"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientMessage_1 = require("../controllers/clientMessage");
const express_1 = require("express");
const api_1 = require("../models/api");
class WhatsappRouter {
    constructor() {
        this.router = express_1.Router();
        this.endPoints();
    }
    endPoints() {
        this.router.post("/webhook", this.hook);
    }
    async hook(req, res) {
        if (req.body.object) {
            if (req.body.entry &&
                req.body.entry[0].changes &&
                req.body.entry[0].changes[0] &&
                req.body.entry[0].changes[0].value.messages &&
                req.body.entry[0].changes[0].value.messages[0]) {
                try {
                    const message = await clientMessage_1.default.manageWebHook(req.body.entry[0].changes[0].value);
                    res.status(api_1.StandarCode.OK).json({
                        status: "success",
                        message,
                    });
                }
                catch (error) {
                    res.status(api_1.DataErrorCode.INVALID).json(error);
                }
            }
        }
        else {
            res.status(api_1.DataErrorCode.INVALID).json({ "error": "EMPTY-DATA" });
        }
    }
}
exports.default = new WhatsappRouter().router;
//# sourceMappingURL=whatsAppRouter.js.map