import { MessagesModel } from "../models/whatsappModels/messageModel";
import { PhonesModel } from "../models/whatsappModels/wabaModel";
import { ChatroomsModel } from "../models/whatsappModels/chatroomModel";

class DbController {
  constructor() {}

  public async findPhoneData(phone_number_id: string) {
    try {
      return await PhonesModel.findOne({ phone_number_id });
    } catch (error) {
      throw error;
    }
  }

  public async getPhonesData() {
    try {
      return await PhonesModel.find({});
    } catch (error) {
      throw error;
    }
  }

  public async updatePhoneData(id: String, payload: any) {
    try {
      const filter = { _id: id };
      const update = { ...payload };
      return await PhonesModel.findOneAndUpdate(filter, update);
    } catch (error) {
      throw error;
    }
  }

  public async findHookVerify(verify_token: string) {
    try {
      return await PhonesModel.findOne({ verify_token });
    } catch (error) {
      throw error;
    }
  }

  public async findChatroom(phone_id: string, wa_number: string) {
    try {
      return await ChatroomsModel.findOne({
        phone_id,
        wa_number,
      });
    } catch (error) {
      throw error;
    }
  }

  public async createChatroom(phone_id: string, wa_number: string) {
    try {
      return await ChatroomsModel.create({ phone_id, wa_number });
    } catch (error) {
      throw error;
    }
  }

  public async insertMessage(
    chatroom_id: string,
    message_id: string,
    text: string,
    image: any,
    document: any,
    whatsapp: string
  ) {
    try {
      return await MessagesModel.create({
        chatroom_id,
        message_id,
        text,
        image,
        document,
        whatsapp,
      });
    } catch (error) {
      throw error;
    }
  }

  public async findMessage(message_id: string) {
    try {
      const link = await MessagesModel.findOne({ message_id });
      if (link) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }

  public async createWabaPhone(
    phone_number: string,
    phone_number_id: string,
    waba_id: string,
    bot_url: string,
    token: string,
    verify_token: string
  ) {
    try {
      return await PhonesModel.create({
        phone_number,
        phone_number_id,
        waba_id,
        bot_url,
        token,
        verify_token,
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new DbController();
