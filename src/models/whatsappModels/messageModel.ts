import { Schema, model, Document } from "mongoose";

interface IPictureMessage extends Document {
  mime_type: string;
  id: string;
}

interface IDocumentMessage extends Document {
  caption: string;
  filename: string;
  mime_type?: string;
  id: string;
}

export interface IMessageModel extends Document {
  chatroom_id: string;
  message_id: string;
  whatsapp: string;
  text?: string;
  document?: IDocumentMessage;
  image?: IPictureMessage;
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
  },
  { timestamps: true }
);

export const MessagesModel = model<IMessageModel>(
  "MessageModel ",
  messageModel,
  "messages"
);
