"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientMessageController_1 = require("../controllers/clientMessageController");
const express_1 = require("express");
const api_1 = require("../models/api");
class WhatsappRouter {
    constructor() {
        this.router = express_1.Router();
        this.endPoints();
    }
    endPoints() {
        this.router.post("/webhook", this.hook);
        this.router.get("/webhook", this.hookVeryfication);
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
                        message: "nada",
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
}
exports.default = new WhatsappRouter().router;
//# sourceMappingURL=whatsAppRouter.js.map