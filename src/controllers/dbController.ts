import { MessagesModel } from "../models/messageModel";

class dbController {
    constructor() {}

    public insertMessage(message_id: string, message: string, whatsapp: string) {
        return MessagesModel.create({message_id, message, whatsapp});
    }

    async findMessage(message_id: string){
        try {
            const link = await MessagesModel.findOne({message_id});
            if(link) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw error;
        }
    }

}

export default new dbController();