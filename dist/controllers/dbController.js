"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messageModel_1 = require("../models/whatsappModels/messageModel");
const wabaModel_1 = require("../models/whatsappModels/wabaModel");
const chatroomModel_1 = require("../models/whatsappModels/chatroomModel");
class dbController {
    constructor() { }
    async findPhoneData(phone_number_id) {
        try {
            return await wabaModel_1.PhonesModel.findOne({ phone_number_id });
        }
        catch (error) {
            throw error;
        }
    }
    async findHookVerify(verify_token) {
        try {
            return await wabaModel_1.PhonesModel.findOne({ verify_token });
        }
        catch (error) {
            throw error;
        }
    }
    async findChatroom(phone_id, wa_number) {
        try {
            return await chatroomModel_1.ChatroomsModel.findOne({
                phone_id,
                wa_number,
            });
        }
        catch (error) {
            throw error;
        }
    }
    async createChatroom(phone_id, wa_number) {
        try {
            return await chatroomModel_1.ChatroomsModel.create({ phone_id, wa_number });
        }
        catch (error) {
            throw error;
        }
    }
    async insertMessage(chatroom_id, message_id, message, whatsapp) {
        try {
            return await messageModel_1.MessagesModel.create({
                chatroom_id,
                message_id,
                message,
                whatsapp,
            });
        }
        catch (error) {
            throw error;
        }
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