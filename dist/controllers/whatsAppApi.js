"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMultimediaMessageToWhatsapp = exports.sendTextMessageToWhatsapp = void 0;
const axios_1 = require("axios");
const sendTextMessageToWhatsapp = async (phone_number_id, to, body, token) => {
    try {
        const whatsAppResponse = await axios_1.default({
            method: "POST",
            url: "https://graph.facebook.com/v12.0/" +
                phone_number_id +
                "/messages?access_token=" +
                token,
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
const sendMultimediaMessageToWhatsapp = async (phone_number_id, to, body, token) => {
    try {
        const whatsAppResponse = await axios_1.default({
            method: "POST",
            url: "https://graph.facebook.com/v12.0/" +
                phone_number_id +
                "/messages?access_token=" +
                token,
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
exports.sendMultimediaMessageToWhatsapp = sendMultimediaMessageToWhatsapp;
//# sourceMappingURL=whatsAppApi.js.map