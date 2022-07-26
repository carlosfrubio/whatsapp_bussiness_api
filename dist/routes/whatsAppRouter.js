"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientMessageController_1 = require("../controllers/clientMessageController");
const dbController_1 = require("../controllers/dbController");
const express_1 = require("express");
const api_1 = require("../models/api");
class WhatsappRouter {
    constructor() {
        this.router = express_1.Router();
        this.endPoints();
    }
    endPoints() {
        this.router.get("/webhook", this.hookVeryfication);
        this.router.get("/phones", this.getPhonesData);
        this.router.post("/webhook", this.hook);
        this.router.post("/create_waba_phone", this.createWabaPhone);
        this.router.put("/update_phone", this.updatePhoneData);
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
}
exports.default = new WhatsappRouter().router;
//# sourceMappingURL=whatsAppRouter.js.map