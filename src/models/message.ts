export enum TypeMessage {
    Text = "text",
    Image = "image",
    Document = "document",
    Audio = "audio",
    Location = "location"
}

export enum StatusWhatsapp {
    Received = "received",
    Sent = "sent",
    Delivered = "delivered",
    Read = "read"
}

export interface TwilioWhats {
    SmsMessageSid: string
    NumMedia: string
    SmsSid: string
    SmsStatus: StatusWhatsapp
    Body: string
    To: string
    NumSegments: string
    MessageSid: string
    AccountSid: string
    From: string
    ApiVersion: string
    MessageStatus: string
    ChannelToAddress: string
    ChannelPrefix: string
    StructuredMessage: string
    ChannelInstallSid: string
    EventType: string
    MediaContentType0: string
    MediaUrl0: string
    Latitude: string
    Longitude: string

}

export interface IMessage {
    user_ext?: string
    user_name?: string
    toWhatsapp?: string
    fromWhatsapp?: string
    type?: TypeMessage
    body?: string
    file?: string
    map?: {lat: string, lng: string}
    whatsId?: string
}
