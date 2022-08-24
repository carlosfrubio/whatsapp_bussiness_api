import Axios from "axios";
import {
  ITextMessage,
  ITemplateMessage,
  IInteractiveMessage,
} from "../models/WabaWebhook";
import firebaseAdmin from "../services/firebase";

const uuid = require("uuid-v4");
const fs = require("fs");
const FormData = require("form-data");
const path = require("../constans/uploads");
const URI = "https://graph.facebook.com/v12.0/";

export const uploadFileToWhatsapp = async (file, phone_number_id, token) => {
  try {
    const fileData = fs.createReadStream(path.dir + file.filename);
    const form = new FormData();
    form.append("messaging_product", "whatsapp");
    form.append("file", fileData, file.filename);
    const whatsAppResponse = await Axios.post(
      URI + phone_number_id + "/media",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return whatsAppResponse.data;
  } catch (error) {
    throw error;
  }
};

export const sendTextMessageToWhatsapp = async (
  phone_number_id: string,
  to: string,
  body: string,
  token: string
) => {
  try {
    const data: ITextMessage = {
      messaging_product: "whatsapp",
      to: to,
      text: { body: body },
    };
    const whatsAppResponse = await Axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url: URI + phone_number_id + "/messages?access_token=" + token,
      data,
      headers: { "Content-Type": "application/json" },
    });
    return whatsAppResponse.data;
  } catch (error) {
    throw error;
  }
};

export const sendTemplateMessageToWhatsapp = async (
  phone_number_id: string,
  to: string,
  template: string,
  token: string,
  language: any,
  components?: any
) => {
  try {
    const data: ITemplateMessage = {
      messaging_product: "whatsapp",
      to: to,
      type: "template",
      template: {
        name: template,
        language: {
          code: language,
        },
        components,
      },
    };
    const whatsAppResponse = await Axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url: URI + phone_number_id + "/messages?access_token=" + token,
      data,
      headers: { "Content-Type": "application/json" },
    });
    return whatsAppResponse.data;
  } catch (error) {
    throw error;
  }
};

export const sendInteractiveMessageToWhatsapp = async (
  phone_number_id: string,
  to: string,
  token: string,
  header?: any,
  body?: any,
  footer?: any,
  type?: "list" | "button",
  action?: any
) => {
  try {
    const data: IInteractiveMessage = {
      messaging_product: "whatsapp",
      to: to,
      type: "interactive",
      recipient_type: "individual",
      interactive: {
        type,
        header,
        body,
        footer,
        action,
      },
    };
    console.log(JSON.stringify(data));
    const whatsAppResponse = await Axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url: URI + phone_number_id + "/messages?access_token=" + token,
      data,
      headers: { "Content-Type": "application/json" },
    });
    return whatsAppResponse.data;
  } catch (error) {
    throw error;
  }
};

export const sendImageMessageToWhatsapp = async (
  phone_number_id,
  to,
  image_id,
  token
) => {
  try {
    const whatsAppResponse = await Axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url: URI + phone_number_id + "/messages?access_token=" + token,
      data: {
        messaging_product: "whatsapp",
        to: to,
        type: "image",
        image: {
          id: image_id,
        },
      },
      headers: { "Content-Type": "application/json" },
    });
    return whatsAppResponse.data;
  } catch (error) {
    throw error;
  }
};

export const sendDocumentMessageToWhatsapp = async (
  phone_number_id,
  to,
  document_id,
  caption,
  filename,
  token
) => {
  try {
    const whatsAppResponse = await Axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url: URI + phone_number_id + "/messages?access_token=" + token,
      data: {
        messaging_product: "whatsapp",
        to: to,
        type: "document",
        document: {
          id: document_id,
          caption: caption ? caption : "",
          filename: filename ? filename : "",
        },
      },
      headers: { "Content-Type": "application/json" },
    });
    return whatsAppResponse.data;
  } catch (error) {
    throw error;
  }
};

export const getMediaUrl = async (media_id: string, token: string) => {
  try {
    const whatsAppResponse = await Axios({
      method: "GET", // Required, HTTP method, a string, e.g. POST, GET
      url: URI + media_id,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return whatsAppResponse.data;
  } catch (error) {
    throw error;
  }
};

export const getMedia = async (
  media_url: string,
  token: string,
  waba_id: string
) => {
  try {
    const response = await Axios({
      method: "GET",
      url: media_url,
      responseType: "stream",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const fileToken = uuid();
    const fileExtention = response.headers["content-type"].split("/")[1];
    const fileLocation = `${path.dir}${fileToken}.${fileExtention}`;
    await response.data.pipe(fs.createWriteStream(fileLocation));
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("TIEM TO SAVE DOC");
      }, 200);
    });
    const bucket = await firebaseAdmin.storage().bucket();
    const fb_res = await bucket.upload(fileLocation, {
      destination: `whatsapp/${waba_id}/${fileToken}.${fileExtention}`,
      metadata: {
        cacheControl: "max-age=31536000",
        metadata: {
          firebaseStorageDownloadTokens: fileToken,
        },
      },
    });

    return `https://firebasestorage.googleapis.com/v0/b/${
      fb_res[0]["metadata"]["bucket"]
    }/o/${encodeURIComponent(
      fb_res[0]["metadata"]["name"]
    )}?alt=media&token=${fileToken}`;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
