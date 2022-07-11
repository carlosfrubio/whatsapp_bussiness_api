"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesModel = void 0;
const mongoose_1 = require("mongoose");
const messageModel = new mongoose_1.Schema({
    message_id: {
        type: String,
        required: true,
        unique: true
    },
    whatsapp: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});
exports.MessagesModel = mongoose_1.model('MessageModel ', messageModel, 'message_model ');
//# sourceMappingURL=messageModel.js.map