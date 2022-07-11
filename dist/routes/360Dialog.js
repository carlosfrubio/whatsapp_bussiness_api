"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientMessage_1 = require("../controllers/clientMessage");
const express_1 = require("express");
const api_1 = require("./../models/api");
class WhatsappRouter {
    constructor() {
        this.router = express_1.Router();
        this.endPoints();
    }
    endPoints() {
        this.router.post("/webhook", this.hook);
        this.router.post("/send_wa_message", this.sendWaMessage);
    }
    async hook(req, res) {
        const data = req.body;
        try {
            const message = await clientMessage_1.default.manageWebHook(data);
            res.status(api_1.StandarCode.OK).json({
                status: "success",
                message,
            });
        }
        catch (error) {
            res.status(api_1.DataErrorCode.INVALID).json(error);
            console.log("Envio un ERROR");
        }
    }
    async sendWaMessage(req, res) {
        const data = req.body;
        try {
            const message = await clientMessage_1.default.sendWaMessage(data);
            console.log(api_1.StandarCode.OK);
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
}
exports.default = new WhatsappRouter().router;
//# sourceMappingURL=360Dialog.js.map