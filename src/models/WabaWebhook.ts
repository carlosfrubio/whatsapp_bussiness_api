export enum TypeMessage {
  Text = "text",
  Image = "image",
  Document = "document",
  Audio = "audio",
  Video = "video",
  Location = "location",
  Interactive = "interactive",
  Button = "button",
}

export enum StatusWhatsapp {
  Received = "received",
  Sent = "sent",
  Delivered = "delivered",
  Read = "read",
}

export enum TypeInteractiveMessage {
  ButtonReply = "button_reply",
  ListReply = "list_reply",
}

export interface IWebhookMessage {
  messaging_product: "whatsapp";
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts: [{ profile: { name: string }; wa_id: string }];
  messages: [
    {
      context?: {
        from: string;
        id: string;
      };
      from: string;
      id: string;
      timestamp: string;
      type: TypeMessage;
      text?: { body: string };
      image?: {
        mime_type: string;
        sha256: string;
        id: string;
      };
      audio?: {
        mime_type: string;
        sha256: string;
        id: string;
        voice: boolean;
      };
      video?: {
        mime_type: string;
        sha256: string;
        id: string;
      };
      document?: {
        caption: string;
        filename: string;
        mime_type: string;
        sha256: string;
        id: string;
      };
      button?: { payload: string; text: string };
      interactive?: {
        type: TypeInteractiveMessage;
        button_reply?: { id: "user_deny"; title: "No" };
        list_reply?: {
          id: string;
          title: string;
          description: string;
        };
      };
    }
  ];
}

export interface ITextMessage {
  messaging_product: "whatsapp";
  to: string;
  text: { body: string };
}

export interface ITemplateMessage {
  messaging_product: "whatsapp";
  to: string;
  type: string;
  template: {
    name: string;
    language: {
      code: "es_MX" | "en_US";
    };
    components?: [
      {
        type: "header" | "body" | "button";
        sub_type?: "quick_reply";
        index?: string;
        parameters: [
          {
            type: "text" | "currency" | "date_time" | "image" | "payload";
            image?: {
              link: string;
            };
            text?: string;
            currency?: {
              fallback_value: string;
              code: "USD" | "COP";
              amount_1000: number;
            };
            date_time?: {
              fallback_value: string;
              day_of_week?: number;
              year?: number;
              month?: number;
              day_of_month?: number;
              hour?: number;
              minute?: number;
              calendar: "GREGORIAN";
            };
            payload?: string;
          }
        ];
      }
    ];
  };
}

export interface IInteractiveMessage {
  messaging_product: "whatsapp";
  to: string;
  type: "interactive";
  recipient_type: "individual";
  interactive: {
    type: "list" | "button";
    header?: {
      type: "text";
      text: string;
    };
    body?: {
      text: string;
    };
    footer?: {
      text: string;
    };
    action?: {
      button?: string;
      sections?: [
        {
          title: string;
          rows: [
            {
              id: string;
              title: string;
              description: string;
            }
          ];
        }
      ];
      buttons?: [
        {
          type: "reply";
          reply: {
            id: string;
            title: string;
          };
        }
      ];
    };
  };
}
