"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesModel = void 0;
const mongoose_1 = require("mongoose");
const messageModel = new mongoose_1.Schema({
    chatroom_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "chatrooms",
        required: true,
    },
    message_id: {
        type: String,
        required: true,
        unique: true,
    },
    whatsapp: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: false,
    },
    document: {
        type: Object,
        required: false,
    },
    image: {
        type: Object,
        required: false,
    },
}, { timestamps: true });
exports.MessagesModel = mongoose_1.model("MessageModel ", messageModel, "messages");
//# sourceMappingURL=messageModel.js.map