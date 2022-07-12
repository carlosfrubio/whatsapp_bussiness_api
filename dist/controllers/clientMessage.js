"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const dbController_1 = require("./dbController");
const whatsAppApi_1 = require("./whatsAppApi");
class ClientMessageController {
    constructor() { }
    async handleHookVerify(token) {
        try {
            return await dbController_1.default.findHookVerify(token);
        }
        catch (error) {
            throw error;
        }
    }
    async handleBotResponses({ from, to, result, phone_number_id, token, chatroom_id, }) {
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
            }
            return true;
        }
        catch (error) {
            return error;
        }
    }
    async manageWebHook(data) {
        var _a;
        try {
            if (data.hasOwnProperty("messages") &&
                ((_a = data.messages[0].text) === null || _a === void 0 ? void 0 : _a.body) !== "") {
                const phone_number_id = data.metadata.phone_number_id;
                const from = data.messages[0].from;
                const msg_id = data.messages[0].id;
                const msg_body = data.messages[0].text.body;
                const phoneData = await dbController_1.default.findPhoneData(phone_number_id);
                if (phoneData) {
                    const messageExists = await dbController_1.default.findMessage(msg_id);
                    if (messageExists) {
                        return;
                    }
                    const { data: result } = await axios_1.default.post("https://rasaingredion.iaxon.co/webhooks/rest/webhook", {
                        message: msg_body,
                        sender: from,
                    });
                    let chatroomData = await dbController_1.default.findChatroom(phoneData.id, from);
                    if (!chatroomData) {
                        chatroomData = await dbController_1.default.createChatroom(phoneData.id, from);
                    }
                    await dbController_1.default.insertMessage(chatroomData.id, msg_id, msg_body, from);
                    this.handleBotResponses({
                        phone_number_id,
                        result,
                        chatroom_id: chatroomData.id,
                        from: phoneData.phone_number,
                        to: from,
                        token: phoneData.token,
                    });
                }
                else {
                    return;
                }
                return "Ok";
            }
            else {
                return "OK";
            }
        }
        catch (error) {
            return error;
        }
    }
    async sendTextMessage(data) {
        const { to, from, body, token, chatroom_id, phone_number_id } = data;
        try {
            const waMessage = await whatsAppApi_1.sendTextMessageToWhatsapp(phone_number_id, to, body, token);
            await dbController_1.default.insertMessage(chatroom_id, waMessage.messages[0]["id"], body, from);
            return "Ok";
        }
        catch (error) {
            console.log("CATCH", error);
            return error;
        }
    }
    async timer() {
        try {
            const time = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve("Ok Timer");
                }, 400);
            });
            return time;
        }
        catch (error) {
            return error;
        }
    }
}
exports.default = new ClientMessageController();
//# sourceMappingURL=clientMessage.js.map