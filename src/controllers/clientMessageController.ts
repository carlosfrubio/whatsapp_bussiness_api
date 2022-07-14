import Axios from "axios";
import DbController from "./dbController";
// import { TypeMessage } from "./../models/message";
import {
  sendTextMessageToWhatsapp,
  sendDocumentMessageToWhatsapp,
  sendImageMessageToWhatsapp,
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
        }
      }
      return true;
    } catch (error) {
      return error;
    }
  }
  public async manageWebHook(data) {
    try {
      if (
        data.hasOwnProperty("messages") &&
        data.messages[0].text?.body !== ""
      ) {
        const phone_number_id = data.metadata.phone_number_id;
        const from = data.messages[0].from; // extract the phone number from the webhook payload
        const msg_id = data.messages[0].id; // extract the Id text from the webhook payload
        const msg_body = data.messages[0].text.body; // extract the message text from the webhook payload
        const phoneData = await DbController.findPhoneData(phone_number_id);
        if (phoneData) {
          const messageExists = await DbController.findMessage(msg_id);
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
            null,
            null,
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
      console.log("CATCH", error);
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
      console.log("CATCH", error);
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
      console.log("CATCH", error);
      return error;
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
