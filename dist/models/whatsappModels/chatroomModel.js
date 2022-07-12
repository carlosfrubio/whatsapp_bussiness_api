"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatroomsModel = void 0;
const mongoose_1 = require("mongoose");
const chatroomsModel = new mongoose_1.Schema({
    phone_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'phones',
        required: true,
        unique: false,
    },
    wa_number: {
        type: String,
        required: true,
        unique: false,
    },
});
exports.ChatroomsModel = mongoose_1.model("ChatroomsModel", chatroomsModel, "chatrooms");
//# sourceMappingURL=chatroomModel.js.map