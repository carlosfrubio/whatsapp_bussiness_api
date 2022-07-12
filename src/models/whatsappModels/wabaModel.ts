import { Schema, model, Document } from "mongoose";

export interface IPhonesModel extends Document {
  phone_number_id: string;
  token: string;
  verify_token: string;
  waba_id: string;
  bot_url: string;
  phone_number: string;
}

const phonesModel = new Schema({
  phone_number_id: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  verify_token: {
    type: String,
    required: true,
    unique: true,
  },
  waba_id: {
    type: String,
    required: true,
    unique: true,
  },
  bot_url: {
    type: String
  },
  phone_number: {
    type: String,
    required: true,
    unique: true
  }
});

export const PhonesModel = model<IPhonesModel>(
  "PhonesModel",
  phonesModel,
  "phones"
);
