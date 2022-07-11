import { Schema, model, Document } from 'mongoose'

export interface IMessageModel extends Document {
    message_id: string
    whatsapp: string
    message: string
}

const messageModel = new Schema({
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

export const MessagesModel = model<IMessageModel>('MessageModel ', messageModel, 'message_model ');