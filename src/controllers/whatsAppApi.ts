import Axios from "axios";
import { config } from "../config";

export const sendTextMessageToWhatsapp = async (
  phone_number_id,
  to,
  body,
  token
) => {
  try {
    const whatsAppResponse = await Axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url:
        "https://graph.facebook.com/v12.0/" +
        phone_number_id +
        "/messages?access_token=" +
        token,
      data: {
        messaging_product: "whatsapp",
        to: to,
        text: { body: body },
      },
      headers: { "Content-Type": "application/json" },
    });
    return whatsAppResponse.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const sendMultimediaMessageToWhatsapp = async (
  phone_number_id,
  to,
  body,
  token
) => {
  try {
    const whatsAppResponse = await Axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url:
        "https://graph.facebook.com/v12.0/" +
        phone_number_id +
        "/messages?access_token=" +
        token,
      data: {
        messaging_product: "whatsapp",
        to: to,
        text: { body: body },
      },
      headers: { "Content-Type": "application/json" },
    });
    return whatsAppResponse.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
