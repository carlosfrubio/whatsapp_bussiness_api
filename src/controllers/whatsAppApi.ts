import Axios from "axios";
import {
  ITextMessage,
  ITemplateMessage,
  IInteractiveMessage,
} from "../models/WabaWebhook";

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

export const getMedia = async (media_url: string, token: string) => {
  try {
    const whatsAppResponse = await Axios({
      method: "GET", // Required, HTTP method, a string, e.g. POST, GET
      url: media_url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return whatsAppResponse;
  } catch (error) {
    throw error;
  }
};
