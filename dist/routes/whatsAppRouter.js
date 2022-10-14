"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require("multer");
const clientMessageController_1 = require("../controllers/clientMessageController");
const dbController_1 = require("../controllers/dbController");
const whatsAppApi_1 = require("../controllers/whatsAppApi");
const express_1 = require("express");
const api_1 = require("../models/api");
const path = require("../constans/uploads");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage: storage });
class WhatsappRouter {
    constructor() {
        this.router = express_1.Router();
        this.endPoints();
    }
    endPoints() {
        this.router.get("/webhook", this.hookVeryfication);
        this.router.get("/phones", this.getPhonesData);
        this.router.post("/media_url", this.getWabaMediaUrl);
        this.router.post("/upload_media", upload.single("file"), this.uploadMedia);
        this.router.post("/download_media", this.downLoadMedia);
        this.router.post("/webhook", this.hook);
        this.router.post("/create_waba_phone", this.createWabaPhone);
        this.router.put("/update_phone", this.updatePhoneData);
        this.router.post("/send_template_message", this.sendTemplateMessage);
    }
    async hook(req, res) {
        if (req.body.object) {
            if (req.body.entry &&
                req.body.entry[0].changes &&
                req.body.entry[0].changes[0] &&
                req.body.entry[0].changes[0].value.messages &&
                req.body.entry[0].changes[0].value.messages[0]) {
                try {
                    const message = await clientMessageController_1.default.manageWebHook(req.body.entry[0].changes[0].value);
                    res.status(api_1.StandarCode.OK).json({
                        status: "success",
                        message,
                    });
                }
                catch (error) {
                    res.status(api_1.DataErrorCode.INVALID).json(error);
                }
            }
            else {
                res.status(api_1.StandarCode.OK).json({
                    status: "success",
                });
            }
        }
        else {
            res.status(api_1.DataErrorCode.INVALID).json({ error: "EMPTY-DATA" });
        }
    }
    async hookVeryfication(req, res) {
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];
        if (mode && token) {
            if (mode === "subscribe") {
                const data = await clientMessageController_1.default.handleHookVerify(token);
                if (data) {
                    res.status(200).send(challenge);
                }
                else {
                    res.status(api_1.DataErrorCode.INVALID).json({ error: "BAD REQUEST" });
                }
            }
            else {
                res.status(api_1.DataErrorCode.INVALID).json({ error: "BAD REQUEST" });
            }
        }
    }
    async createWabaPhone(req, res) {
        try {
            if (req.body["phone_number"] &&
                req.body["phone_number_id"] &&
                req.body["waba_id"] &&
                req.body["bot_url"] &&
                req.body["token"] &&
                req.body["verify_token"]) {
                const message = await dbController_1.default.createWabaPhone(req.body["phone_number"], req.body["phone_number_id"], req.body["waba_id"], req.body["bot_url"], req.body["token"], req.body["verify_token"]);
                res.status(api_1.StandarCode.OK).json({
                    status: "success",
                    message,
                });
            }
        }
        catch (error) {
            res.status(api_1.DataErrorCode.INVALID).json(error);
        }
    }
    async getPhonesData(req, res) {
        try {
            const data = await dbController_1.default.getPhonesData();
            res.status(api_1.StandarCode.OK).json({
                status: "success",
                data,
            });
        }
        catch (error) {
            res.status(api_1.DataErrorCode.INVALID).json(error);
        }
    }
    async updatePhoneData(req, res) {
        try {
            if (req.body.id && req.body.payload) {
                const { id, payload } = req.body;
                const data = await dbController_1.default.updatePhoneData(id, payload);
                if (data) {
                    res.status(api_1.StandarCode.OK).json({
                        status: "success",
                        data,
                    });
                }
                else {
                    res.status(api_1.DataErrorCode.NOT_FOUND).json({
                        status: "error",
                        message: "Phone not found",
                    });
                }
            }
            else {
                res.status(api_1.DataErrorCode.INVALID).json({ error: "EMPTY DATA" });
            }
        }
        catch (error) {
            res.status(api_1.DataErrorCode.INVALID).json(error);
        }
    }
    async sendTemplateMessage(req, res) {
        const data = req.body;
        const { phone_number_id, to, template, token, language, components } = data;
        try {
            const message = await whatsAppApi_1.sendTemplateMessageToWhatsapp(phone_number_id, to, template, token, language, components);
            res.status(api_1.StandarCode.OK).json({
                status: "success",
                message,
            });
            console.log("Envio un OK");
        }
        catch (error) {
            res.status(api_1.DataErrorCode.INVALID).json(error);
            console.log("Envio un ERROR");
        }
    }
    async getWabaMediaUrl(req, res) {
        const { media_id, phone_number_id } = req.body;
        try {
            const phoneData = await dbController_1.default.findPhoneData(phone_number_id);
            if (!phoneData) {
                res.status(api_1.DataErrorCode.INVALID).json({ error: "Phone not found!" });
            }
            else {
                const message = await whatsAppApi_1.getMediaUrl(media_id, phoneData.token);
                console.log(message);
                res.status(api_1.StandarCode.OK).json({
                    status: "success",
                    data: message,
                });
            }
        }
        catch (error) {
            res.status(api_1.DataErrorCode.INVALID).json(error);
            console.log("Envio un ERROR");
        }
    }
    async uploadMedia(req, res) {
        const { phone_number_id } = req.body;
        const file = req.file;
        try {
            const phoneData = await dbController_1.default.findPhoneData(phone_number_id);
            if (!phoneData) {
                res.status(api_1.DataErrorCode.INVALID).json({ error: "Phone not found!" });
            }
            else {
                const message = await whatsAppApi_1.uploadFileToWhatsapp(file, phone_number_id, phoneData.token);
                res.status(api_1.StandarCode.OK).json({
                    status: "success",
                    data: message,
                });
            }
        }
        catch (error) {
            console.log(error);
            res.status(api_1.DataErrorCode.INVALID).json(error);
        }
    }
    async downLoadMedia(req, res) {
        const { media_url, phone_number_id } = req.body;
        try {
            const phoneData = await dbController_1.default.findPhoneData(phone_number_id);
            if (!phoneData) {
                res.status(api_1.DataErrorCode.INVALID).json({ error: "Phone not found!" });
            }
            else {
                const response = await whatsAppApi_1.getMedia(media_url, phoneData.token, phoneData.waba_id);
                res.status(api_1.StandarCode.OK).json({
                    status: "success",
                    data: response,
                });
            }
        }
        catch (error) {
            console.log("ERROR R", error);
            res.status(api_1.DataErrorCode.INVALID).json(error);
            console.log("Envio un ERROR");
        }
    }
}
exports.default = new WhatsappRouter().router;
//# sourceMappingURL=whatsAppRouter.js.map