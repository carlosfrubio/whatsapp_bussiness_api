"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTextMessageToWhatsapp = void 0;
const axios_1 = require("axios");
const config_1 = require("../config");
const sendTextMessageToWhatsapp = async (phone_number_id, to, body) => {
    try {
        const whatsAppResponse = await axios_1.default({
            method: "POST",
            url: "https://graph.facebook.com/v12.0/" +
                phone_number_id +
                "/messages?access_token=" +
                config_1.config.token,
            data: {
                messaging_product: "whatsapp",
                to: to,
                text: { body: body },
            },
            headers: { "Content-Type": "application/json" },
        });
        return whatsAppResponse.data;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.sendTextMessageToWhatsapp = sendTextMessageToWhatsapp;
//# sourceMappingURL=whatsAppApi.js.map