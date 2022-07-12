import { Schema, model, Document } from "mongoose";

export interface IChatroomsModel extends Document {
  phone_id: string;
  wa_number: string;
}

const chatroomsModel = new Schema({
  phone_id: {
    type: Schema.Types.ObjectId,
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

export const ChatroomsModel = model<IChatroomsModel>(
  "ChatroomsModel",
  chatroomsModel,
  "chatrooms"
);
