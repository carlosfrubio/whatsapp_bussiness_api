import Axios from "axios";

export const uploadFileToWhatsapp = async (file, phone_number_id, token) => {
  try {
    const data = new FormData();
    data.append("messaging_product", "whatsapp");
    data.append("file", file);
    const whatsAppResponse = await Axios({
      method: "post",
      url:
        "https://graph.facebook.com/v12.0/" +
        phone_number_id +
        "/media?access_token=" +
        token,
      data: data,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return whatsAppResponse.data;
  } catch (error) {
    throw error;
  }
};

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
      url:
        "https://graph.facebook.com/v12.0/" +
        phone_number_id +
        "/messages?access_token=" +
        token,
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
      url:
        "https://graph.facebook.com/v12.0/" +
        phone_number_id +
        "/messages?access_token=" +
        token,
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
