import Axios from "axios";
import dbController from "./dbController";
// import { TypeMessage } from "./../models/message";
import { sendTextMessageToWhatsapp } from "./whatsAppApi";

class ClientMessageController {
  constructor() {}

  public async handleHookVerify(token) {
    try {
      return await dbController.findHookVerify(token);
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
        }
        /* else if (
          response.hasOwnProperty("custom") &&
          response.custom?.image !== ""
        ) {
          await this.sendWaMultiMessage({
            recipient_id: response.recipient_id,
            message_content: response.custom.image,
            caption: response.custom.caption,
          });
          await this.timer();
        } */
      }
      return true;
    } catch (error) {
      return error;
    }
  }
  public async manageWebHook(data) {
    //console.log("DATA ENVIADA POR WA", JSON.stringify(data));
    try {
      if (
        data.hasOwnProperty("messages") &&
        data.messages[0].text?.body !== ""
      ) {
        const phone_number_id = data.metadata.phone_number_id;
        const from = data.messages[0].from; // extract the phone number from the webhook payload
        const msg_id = data.messages[0].id; // extract the Id text from the webhook payload
        const msg_body = data.messages[0].text.body; // extract the message text from the webhook payload

        /* const messageExists = await dbController.findMessage(msg_id);

        if (messageExists) {
          return "Ok";
        } */

        const phoneData = await dbController.findPhoneData(phone_number_id);
        if (phoneData) {
          const messageExists = await dbController.findMessage(msg_id);
          if (messageExists) {
            return;
          }
          const { data: result } = await Axios.post(
            "https://rasaingredion.iaxon.co/webhooks/rest/webhook",
            {
              message: msg_body,
              sender: from,
            }
          );

          let chatroomData = await dbController.findChatroom(
            phoneData.id,
            from
          );
          if (!chatroomData) {
            chatroomData = await dbController.createChatroom(
              phoneData.id,
              from
            );
          }
          await dbController.insertMessage(
            chatroomData.id,
            msg_id,
            msg_body,
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
        /* await dbController.insertMessage(
            msg_id,
            msg_body,
            from
        ); */
        return "Ok";
      } else {
        return "OK";
      }
    } catch (error) {
      //console.log("CATCH", error);
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
      await dbController.insertMessage(
        chatroom_id,
        waMessage.messages[0]["id"],
        body,
        from
      );
      return "Ok";
    } catch (error) {
      console.log("CATCH", error);
      return error;
    }
  }

  /* public async sendWaMultiMessage(data) {
    const { recipient_id, message_content, caption } = data;
    try {
      const message = {
        recipient_type: "individual",
        to: recipient_id,
        type: TypeMessage.Document,
        document: {
          id: message_content,
          caption: `${caption}.pdf`,
          filename: `${caption}.pdf`,
        },
      };
      //console.log("MENSAJE A ENVIAR", JSON.stringify(message));
      const waMessage = await dialog360(message);
      await dbController.insertMessage(
        waMessage?.messages[0]["id"],
        `${caption}.pdf`,
        "573212144420"
      );
      return "Ok";
    } catch (error) {
      console.log("CATCH", error);
      return error;
    }
  } */

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
