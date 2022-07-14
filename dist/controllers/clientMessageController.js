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
        var _a;
        console.log("ENTRO AL BOT RESPONSE");
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
                else if (response.hasOwnProperty("custom") &&
                    response.custom.hasOwnProperty("document")) {
                    await this.sendDocumentMessage({
                        phone_number_id,
                        chatroom_id,
                        token,
                        to,
                        from,
                        document_id: response.custom.document,
                        caption: response.custom.caption,
                        filename: (_a = response.custom) === null || _a === void 0 ? void 0 : _a.filename,
                    });
                    await this.timer();
                }
                else if (response.hasOwnProperty("custom") &&
                    response.custom.hasOwnProperty("image")) {
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
                console.log("messageExists", phoneData);
                if (phoneData) {
                    const messageExists = await dbController_1.default.findMessage(msg_id);
                    if (messageExists) {
                        console.log("messageExists", messageExists);
                        return;
                    }
                    const { data: result } = await axios_1.default.post(phoneData.bot_url, {
                        message: msg_body,
                        sender: from,
                    });
                    console.log("result", result);
                    let chatroomData = await dbController_1.default.findChatroom(phoneData.id, from);
                    if (!chatroomData) {
                        chatroomData = await dbController_1.default.createChatroom(phoneData.id, from);
                    }
                    await dbController_1.default.insertMessage(chatroomData.id, msg_id, msg_body, null, null, from);
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
            await dbController_1.default.insertMessage(chatroom_id, waMessage.messages[0]["id"], body, null, null, from);
            return "Ok";
        }
        catch (error) {
            console.log("CATCH", error);
            return error;
        }
    }
    async sendDocumentMessage(data) {
        const { phone_number_id, chatroom_id, token, to, from, document_id, caption, filename, } = data;
        try {
            const waMessage = await whatsAppApi_1.sendDocumentMessageToWhatsapp(phone_number_id, to, document_id, caption, filename, token);
            await dbController_1.default.insertMessage(chatroom_id, waMessage.messages[0]["id"], null, null, { caption, filename, id: document_id }, from);
            return "Ok";
        }
        catch (error) {
            console.log("CATCH", error);
            return error;
        }
    }
    async sendImageMessage(data) {
        const { phone_number_id, chatroom_id, token, to, from, image_id } = data;
        try {
            const waMessage = await whatsAppApi_1.sendImageMessageToWhatsapp(phone_number_id, to, image_id, token);
            await dbController_1.default.insertMessage(chatroom_id, waMessage.messages[0]["id"], null, { id: image_id }, null, from);
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
//# sourceMappingURL=clientMessageController.js.map