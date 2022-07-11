"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messageModel_1 = require("../models/messageModel");
class dbController {
    constructor() { }
    insertMessage(message_id, message, whatsapp) {
        return messageModel_1.MessagesModel.create({ message_id, message, whatsapp });
    }
    async findMessage(message_id) {
        try {
            const link = await messageModel_1.MessagesModel.findOne({ message_id });
            if (link) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = new dbController();
//# sourceMappingURL=dbController.js.map