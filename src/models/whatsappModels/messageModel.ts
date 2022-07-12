import { Schema, model, Document } from "mongoose";

export interface IMessageModel extends Document {
  chatroom_id: string;
  message_id: string;
  whatsapp: string;
  message: string;
}

const messageModel = new Schema(
  {
    chatroom_id: {
      type: Schema.Types.ObjectId,
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
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const MessagesModel = model<IMessageModel>(
  "MessageModel ",
  messageModel,
  "messages"
);
