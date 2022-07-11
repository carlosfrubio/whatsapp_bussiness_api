"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const whatsAppApi_1 = require("./whatsAppApi");
class ClientMessageController {
    constructor() { }
    async handleBotResponses(result, phone_number_id, from) {
        try {
            for (const response of result) {
                if (response.hasOwnProperty("text") && response.text !== "") {
                    await this.sendTextMessage({
                        phone_number_id,
                        to: from,
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
                const msg = {
                    message: msg_body,
                    sender: from,
                };
                const { data: result } = await axios_1.default.post("https://rasaingredion.iaxon.co/webhooks/rest/webhook", msg);
                this.handleBotResponses(result, phone_number_id, from);
                return "Ok";
            }
            else {
                return "OK";
            }
        }
        catch (error) {
            console.log("CATCH", error);
            return error;
        }
    }
    async sendTextMessage(data) {
        const { phone_number_id, to, body } = data;
        try {
            const waMessage = await whatsAppApi_1.sendTextMessageToWhatsapp(phone_number_id, to, body);
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