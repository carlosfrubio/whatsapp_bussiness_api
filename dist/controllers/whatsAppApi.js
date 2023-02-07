"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMedia = exports.getMediaUrl = exports.sendDocumentMessageToWhatsapp = exports.sendImageMessageToWhatsapp = exports.sendInteractiveMessageToWhatsapp = exports.sendMediaToWhatsappByUrl = exports.sendTemplateMessageToWhatsapp = exports.sendTextMessageToWhatsapp = exports.uploadFileToWhatsapp = void 0;
const axios_1 = require("axios");
const WabaWebhook_1 = require("../models/WabaWebhook");
const firebase_1 = require("../services/firebase");
const uuid = require("uuid-v4");
const fs = require("fs");
const FormData = require("form-data");
const path = require("../constans/uploads");
const URI = "https://graph.facebook.com/v12.0/";
const uploadFileToWhatsapp = async (file, phone_number_id, token) => {
    try {
        const fileData = fs.createReadStream(path.dir + file.filename);
        const form = new FormData();
        form.append("messaging_product", "whatsapp");
        form.append("file", fileData, file.filename);
        const whatsAppResponse = await axios_1.default.post(URI + phone_number_id + "/media", form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${token}`,
            },
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
        const data = {
            messaging_product: "whatsapp",
            to: to,
            text: { body: body },
        };
        const whatsAppResponse = await axios_1.default({
            method: "POST",
            url: URI + phone_number_id + "/messages?access_token=" + token,
            data,
            headers: { "Content-Type": "application/json" },
        });
        return whatsAppResponse.data;
    }
    catch (error) {
        throw error;
    }
};
exports.sendTextMessageToWhatsapp = sendTextMessageToWhatsapp;
const sendTemplateMessageToWhatsapp = async (phone_number_id, to, template, token, language, components) => {
    try {
        const data = {
            messaging_product: "whatsapp",
            to: to,
            type: "template",
            template: {
                name: template,
                language: {
                    code: language,
                },
                components,
            },
        };
        const whatsAppResponse = await axios_1.default({
            method: "POST",
            url: URI + phone_number_id + "/messages?access_token=" + token,
            data,
            headers: { "Content-Type": "application/json" },
        });
        return whatsAppResponse.data;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.sendTemplateMessageToWhatsapp = sendTemplateMessageToWhatsapp;
const sendMediaToWhatsappByUrl = async (phone_number_id, to, type, token, link) => {
    try {
        const data = {
            messaging_product: "whatsapp",
            to: to,
            type: type,
        };
        if (type === WabaWebhook_1.TypeMessage.Image) {
            data.image = { link };
        }
        else if (type === WabaWebhook_1.TypeMessage.Document) {
            data.document = { link };
        }
        else if (type === WabaWebhook_1.TypeMessage.Video) {
            data.video = { link };
        }
        else if (type === WabaWebhook_1.TypeMessage.Audio) {
            data.audio = { link };
        }
        const whatsAppResponse = await axios_1.default({
            method: "POST",
            url: URI + phone_number_id + "/messages?access_token=" + token,
            data,
            headers: { "Content-Type": "application/json" },
        });
        return whatsAppResponse.data;
    }
    catch (error) {
        throw error;
    }
};
exports.sendMediaToWhatsappByUrl = sendMediaToWhatsappByUrl;
const sendInteractiveMessageToWhatsapp = async (phone_number_id, to, token, header, body, footer, type, action) => {
    try {
        const data = {
            messaging_product: "whatsapp",
            to: to,
            type: "interactive",
            recipient_type: "individual",
            interactive: {
                type,
                header,
                body,
                footer,
                action,
            },
        };
        const whatsAppResponse = await axios_1.default({
            method: "POST",
            url: URI + phone_number_id + "/messages?access_token=" + token,
            data,
            headers: { "Content-Type": "application/json" },
        });
        return whatsAppResponse.data;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.sendInteractiveMessageToWhatsapp = sendInteractiveMessageToWhatsapp;
const sendImageMessageToWhatsapp = async (phone_number_id, to, image_id, token) => {
    try {
        const whatsAppResponse = await axios_1.default({
            method: "POST",
            url: URI + phone_number_id + "/messages?access_token=" + token,
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
            url: URI + phone_number_id + "/messages?access_token=" + token,
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
const getMediaUrl = async (media_id, token) => {
    try {
        const whatsAppResponse = await axios_1.default({
            method: "GET",
            url: URI + media_id,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return whatsAppResponse.data;
    }
    catch (error) {
        throw error;
    }
};
exports.getMediaUrl = getMediaUrl;
const getMedia = async (media_url, token, waba_id) => {
    try {
        const response = await axios_1.default({
            method: "GET",
            url: media_url,
            responseType: "stream",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const fileToken = uuid();
        const fileExtention = response.headers["content-type"].split("/")[1];
        const fileLocation = `${path.dir}${fileToken}.${fileExtention}`;
        await response.data.pipe(fs.createWriteStream(fileLocation));
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("TIEM TO SAVE DOC");
            }, 200);
        });
        const bucket = await firebase_1.default.storage().bucket();
        const fb_res = await bucket.upload(fileLocation, {
            destination: `whatsapp/${waba_id}/${fileToken}.${fileExtention}`,
            metadata: {
                cacheControl: "max-age=31536000",
                metadata: {
                    firebaseStorageDownloadTokens: fileToken,
                },
            },
        });
        return `https://firebasestorage.googleapis.com/v0/b/${fb_res[0]["metadata"]["bucket"]}/o/${encodeURIComponent(fb_res[0]["metadata"]["name"])}?alt=media&token=${fileToken}`;
    }
    catch (error) {
        console.log("error", error);
        throw error;
    }
};
exports.getMedia = getMedia;
//# sourceMappingURL=whatsAppApi.js.map