"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const dbController_1 = require("./dbController");
const WabaWebhook_1 = require("../models/WabaWebhook");
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
        var _a, _b, _c, _d, _e, _f;
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
                else if (response.hasOwnProperty("custom") &&
                    response.custom.hasOwnProperty("template")) {
                    await this.sendTemplateMessage({
                        phone_number_id,
                        chatroom_id,
                        token,
                        to,
                        from,
                        template: response.custom.template,
                        language: "es_MX",
                    });
                }
                else if (response.hasOwnProperty("custom") &&
                    response.custom.hasOwnProperty("interactive")) {
                    await this.sendInteractiveMessage({
                        phone_number_id,
                        chatroom_id,
                        token,
                        to,
                        from,
                        header: (_b = response.custom.interactive) === null || _b === void 0 ? void 0 : _b.header,
                        body: (_c = response.custom.interactive) === null || _c === void 0 ? void 0 : _c.body,
                        footer: (_d = response.custom.interactive) === null || _d === void 0 ? void 0 : _d.footer,
                        type: (_e = response.custom.interactive) === null || _e === void 0 ? void 0 : _e.type,
                        action: (_f = response.custom.interactive) === null || _f === void 0 ? void 0 : _f.action,
                    });
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
            console.log("INCOMING_MESSAGE", JSON.stringify(data));
            if (data.hasOwnProperty("messages") &&
                ((_a = data.messages[0].text) === null || _a === void 0 ? void 0 : _a.body) !== "") {
                const phone_number_id = data.metadata.phone_number_id;
                const from = data.messages[0].from;
                const msg_id = data.messages[0].id;
                const msg_type = data.messages[0].type;
                const phoneData = await dbController_1.default.findPhoneData(phone_number_id);
                let msg_body = "";
                if (msg_type === WabaWebhook_1.TypeMessage.Text) {
                    msg_body = data.messages[0].text.body;
                }
                else if (msg_type === WabaWebhook_1.TypeMessage.Button) {
                    msg_body = data.messages[0].button.payload;
                }
                else if (msg_type === WabaWebhook_1.TypeMessage.Interactive) {
                    msg_body = data.messages[0].interactive.button_reply.id;
                }
                else if (msg_type === WabaWebhook_1.TypeMessage.Image) {
                    msg_body = "PIC: " + data.messages[0].image.id;
                }
                else if (msg_type === WabaWebhook_1.TypeMessage.Document) {
                    msg_body = "DOC: " + data.messages[0].document.id;
                }
                console.log(msg_body);
                if (phoneData) {
                    const messageExists = await dbController_1.default.findMessage(msg_id);
                    if (messageExists) {
                        return;
                    }
                    const { data: result } = await axios_1.default.post(phoneData.bot_url, {
                        message: msg_body,
                        sender: from,
                    });
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
            return error;
        }
    }
    async sendTemplateMessage(data) {
        const { to, from, template, token, chatroom_id, phone_number_id, language, } = data;
        try {
            const waMessage = await whatsAppApi_1.sendTemplateMessageToWhatsapp(phone_number_id, to, template, token, language);
            console.log(waMessage);
            await dbController_1.default.insertMessage(chatroom_id, waMessage.messages[0]["id"], template, null, null, from);
            return "Ok";
        }
        catch (error) {
            return error;
        }
    }
    async sendInteractiveMessage(data) {
        const { to, from, token, chatroom_id, phone_number_id, header, body, footer, type, action, } = data;
        try {
            const waMessage = await whatsAppApi_1.sendInteractiveMessageToWhatsapp(phone_number_id, to, token, header, body, footer, type, action);
            console.log(waMessage);
            await dbController_1.default.insertMessage(chatroom_id, waMessage.messages[0]["id"], body, null, null, from);
            return "Ok";
        }
        catch (error) {
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