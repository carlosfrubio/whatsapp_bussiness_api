import Axios from "axios";
import DbController from "./dbController";
import { IWebhookMessage, TypeMessage } from "../models/WabaWebhook";
import {
  sendTextMessageToWhatsapp,
  sendDocumentMessageToWhatsapp,
  sendImageMessageToWhatsapp,
  sendTemplateMessageToWhatsapp,
  sendInteractiveMessageToWhatsapp,
  getMediaUrl,
  getMedia,
} from "./whatsAppApi";

class ClientMessageController {
  constructor() {}

  public async handleHookVerify(token) {
    try {
      return await DbController.findHookVerify(token);
    } catch (error) {
      throw error;
    }
  }

  private async handleBotResponses({
    from,
    to,
    result,
    phone_number_id,
    token,
    chatroom_id,
  }) {
    try {
      for (const response of result) {
        if (response.hasOwnProperty("text") && response.text !== "") {
          await this.sendTextMessage({
            phone_number_id,
            chatroom_id,
            token,
            to,
            from,
            body: response.text,
          });
          await this.timer();
        } else if (
          response.hasOwnProperty("custom") &&
          response.custom.hasOwnProperty("document")
        ) {
          await this.sendDocumentMessage({
            phone_number_id,
            chatroom_id,
            token,
            to,
            from,
            document_id: response.custom.document,
            caption: response.custom.caption,
            filename: response.custom?.filename,
          });
          await this.timer();
        } else if (
          response.hasOwnProperty("custom") &&
          response.custom.hasOwnProperty("image")
        ) {
          await this.sendImageMessage({
            phone_number_id,
            chatroom_id,
            token,
            to,
            from,
            image_id: response.custom.image,
          });
          await this.timer();
        } else if (
          response.hasOwnProperty("custom") &&
          response.custom.hasOwnProperty("template")
        ) {
          await this.sendTemplateMessage({
            phone_number_id,
            chatroom_id,
            token,
            to,
            from,
            template: response.custom.template,
            language: "es_MX",
          });
        } else if (
          response.hasOwnProperty("custom") &&
          response.custom.hasOwnProperty("interactive")
        ) {
          await this.sendInteractiveMessage({
            phone_number_id,
            chatroom_id,
            token,
            to,
            from,
            header: response.custom.interactive?.header,
            body: response.custom.interactive?.body,
            footer: response.custom.interactive?.footer,
            type: response.custom.interactive?.type,
            action: response.custom.interactive?.action,
          });
        }
      }
      return true;
    } catch (error) {
      return error;
    }
  }
  public async manageWebHook(data: IWebhookMessage) {
    //return true
    try {
      console.log("INCOMING_MESSAGE", JSON.stringify(data));
      if (
        data.hasOwnProperty("messages") &&
        data.messages[0].text?.body !== ""
      ) {
        const phone_number_id = data.metadata.phone_number_id;
        const from = data.messages[0].from; // extract the phone number from the webhook payload
        const msg_id = data.messages[0].id; // extract the Id text from the webhook payload
        const msg_type = data.messages[0].type;
        const phoneData = await DbController.findPhoneData(phone_number_id);
        let msg_body = "";
        let msg_image = {};
        let msg_document = {};

        if (msg_type === TypeMessage.Text) {
          msg_body = data.messages[0].text.body;
        } else if (msg_type === TypeMessage.Button) {
          msg_body = data.messages[0].button.payload;
        } else if (msg_type === TypeMessage.Interactive) {
          msg_body = data.messages[0].interactive.button_reply.id;
        } else if (msg_type === TypeMessage.Image) {
          const downloadUrl = await this.getFileUrl(
            data.messages[0].image.id,
            phoneData.token
          );
          msg_image = { id: data.messages[0].image.id, downloadUrl };
          msg_body = `FILE|${downloadUrl}`;
        } else if (msg_type === TypeMessage.Document) {
          const downloadUrl = await this.getFileUrl(
            data.messages[0].document.id,
            phoneData.token
          );
          msg_document = { id: data.messages[0].document.id, downloadUrl };
          msg_body = `FILE|${downloadUrl}`;
        }
        if (phoneData) {
          //console.log("phoneData", phoneData);
          const messageExists = await DbController.findMessage(msg_id);
          //console.log("messageExists", messageExists);
          if (messageExists) {
            return;
          }
          const { data: result } = await Axios.post(phoneData.bot_url, {
            message: msg_body,
            sender: from,
          });
          let chatroomData = await DbController.findChatroom(
            phoneData.id,
            from
          );
          if (!chatroomData) {
            chatroomData = await DbController.createChatroom(
              phoneData.id,
              from
            );
          }
          await DbController.insertMessage(
            chatroomData.id,
            msg_id,
            msg_body,
            msg_image,
            msg_document,
            from
          );
          this.handleBotResponses({
            phone_number_id,
            result,
            chatroom_id: chatroomData.id,
            from: phoneData.phone_number,
            to: from,
            token: phoneData.token,
          });
        } else {
          return;
        }
        return "Ok";
      } else {
        return "OK";
      }
    } catch (error) {
      return error;
    }
  }

  public async sendTextMessage(data) {
    const { to, from, body, token, chatroom_id, phone_number_id } = data;
    try {
      const waMessage = await sendTextMessageToWhatsapp(
        phone_number_id,
        to,
        body,
        token
      );
      await DbController.insertMessage(
        chatroom_id,
        waMessage.messages[0]["id"],
        body,
        null,
        null,
        from
      );
      return "Ok";
    } catch (error) {
      return error;
    }
  }

  public async sendTemplateMessage(data) {
    const {
      to,
      from,
      template,
      token,
      chatroom_id,
      phone_number_id,
      language,
    } = data;
    try {
      const waMessage = await sendTemplateMessageToWhatsapp(
        phone_number_id,
        to,
        template,
        token,
        language
      );
      console.log(waMessage);
      await DbController.insertMessage(
        chatroom_id,
        waMessage.messages[0]["id"],
        template,
        null,
        null,
        from
      );
      return "Ok";
    } catch (error) {
      return error;
    }
  }

  public async sendInteractiveMessage(data) {
    const {
      to,
      from,
      token,
      chatroom_id,
      phone_number_id,
      header,
      body,
      footer,
      type,
      action,
    } = data;
    try {
      const waMessage = await sendInteractiveMessageToWhatsapp(
        phone_number_id,
        to,
        token,
        header,
        body,
        footer,
        type,
        action
      );
      console.log(waMessage);
      await DbController.insertMessage(
        chatroom_id,
        waMessage.messages[0]["id"],
        body,
        null,
        null,
        from
      );
      return "Ok";
    } catch (error) {
      return error;
    }
  }

  public async sendDocumentMessage(data) {
    const {
      phone_number_id,
      chatroom_id,
      token,
      to,
      from,
      document_id,
      caption,
      filename,
    } = data;
    try {
      const waMessage = await sendDocumentMessageToWhatsapp(
        phone_number_id,
        to,
        document_id,
        caption,
        filename,
        token
      );
      await DbController.insertMessage(
        chatroom_id,
        waMessage.messages[0]["id"],
        null,
        null,
        { caption, filename, id: document_id },
        from
      );
      return "Ok";
    } catch (error) {
      return error;
    }
  }
  public async sendImageMessage(data) {
    const { phone_number_id, chatroom_id, token, to, from, image_id } = data;
    try {
      const waMessage = await sendImageMessageToWhatsapp(
        phone_number_id,
        to,
        image_id,
        token
      );

      await DbController.insertMessage(
        chatroom_id,
        waMessage.messages[0]["id"],
        null,
        { id: image_id },
        null,
        from
      );
      return "Ok";
    } catch (error) {
      return error;
    }
  }

  private async getFileUrl(media_id, token) {
    try {
      const wabaUrl = await getMediaUrl(media_id, token);
      const downLoadUrl = await getMedia(wabaUrl.url, token);
      console.log("downLoadUrl", downLoadUrl);
      return `${downLoadUrl}`;
    } catch (error) {
      throw error;
    }
  }

  private async timer() {
    try {
      const time = await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("Ok Timer");
        }, 400);
      });
      return time;
    } catch (error) {
      return error;
    }
  }
}

export default new ClientMessageController();
