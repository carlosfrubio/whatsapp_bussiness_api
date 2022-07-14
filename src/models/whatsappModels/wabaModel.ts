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


//{  "_id": {    "$oid": "62cf6378920d4a605e7f8634"  },  "token": "EAAOaZChJH7hoBAJtMVnKFH3RvkfgIwWdZBCoWIG9bY0WgZBSb2Y2E91bI1dZA01xMsfDZCfYZClgQixBUn7sh2T6Kf38ZCOUWI23kHnioVi7vD5eWt4ubZBRZBRjTF8ZBcvxAYB1fNqq6Jt9VTroak1nlCJHyjZCDPqrDnyCOdqAwZBXTiu3y6lZBnbMIYZC51ZAvnwTYB0a6hiT9DV9jvkXyq6S2QajVK5uWPwss0ZD",  "bot_url": "https://rasaingredion.iaxon.co/webhooks/rest/webhook",  "phone_number": "573214384387",  "verify_token": "EAAOaZChJH7hoBAC3MNVBLfcpMEt9bSCFrk7Y8eVNUn0FDKbOWkzNNUU4PRI6Fjs4zEZBN1qIe0LMpQZBReZAZCSMA5JkZC7xe0uC5JSsQufEoJ3YYadiivWv8lzei5HCRPyccUt631r0qzN8G9tmEZCZBsjBJ7e7E5lgeGz921Rz7t4PPxYqLtu6qeSBd572rPESZAS3pOYuyaN5yqymftBhLnOi8X2bIZB5AZD",  "waba_id": "111720974938259",  "phone_number_id": "102876375835516"}