"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cors = require("cors");
const api_1 = require("./../models/api");
const whatsAppRouter_1 = require("./whatsAppRouter");
class Routes {
    constructor() {
        this.router = express_1.Router();
        this.router.use(cors());
        this.router.use(whatsAppRouter_1.default);
        this.router.get("/health", async (req, res) => {
            res.status(api_1.StandarCode.OK).json({
                status: "ok",
            });
        });
    }
}
exports.default = new Routes().router;
//# sourceMappingURL=index.js.map