"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDocumentMessageToWhatsapp = exports.sendImageMessageToWhatsapp = exports.sendTextMessageToWhatsapp = exports.uploadFileToWhatsapp = void 0;
const axios_1 = require("axios");
const uploadFileToWhatsapp = async (file, phone_number_id, token) => {
    try {
        const data = new FormData();
        data.append("messaging_product", "whatsapp");
        data.append("file", file);
        const whatsAppResponse = await axios_1.default({
            method: "post",
            url: "https://graph.facebook.com/v12.0/" +
                phone_number_id +
                "/media?access_token=" +
                token,
            data: data,
            headers: { "Content-Type": "multipart/form-data" },
        });
        return whatsAppResponse.data;
    }
    catch (error) {
        throw error;
    }
};
exports.uploadFileToWhatsapp = uploadFileToWhatsapp;
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
        throw error;
    }
};
exports.sendTextMessageToWhatsapp = sendTextMessageToWhatsapp;
const sendImageMessageToWhatsapp = async (phone_number_id, to, image_id, token) => {
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
                type: "image",
                image: {
                    id: image_id,
                },
            },
            headers: { "Content-Type": "application/json" },
        });
        return whatsAppResponse.data;
    }
    catch (error) {
        throw error;
    }
};
exports.sendImageMessageToWhatsapp = sendImageMessageToWhatsapp;
const sendDocumentMessageToWhatsapp = async (phone_number_id, to, document_id, caption, filename, token) => {
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
                type: "document",
                document: {
                    id: document_id,
                    caption: caption ? caption : "",
                    filename: filename ? filename : "",
                },
            },
            headers: { "Content-Type": "application/json" },
        });
        return whatsAppResponse.data;
    }
    catch (error) {
        throw error;
    }
};
exports.sendDocumentMessageToWhatsapp = sendDocumentMessageToWhatsapp;
//# sourceMappingURL=whatsAppApi.js.map