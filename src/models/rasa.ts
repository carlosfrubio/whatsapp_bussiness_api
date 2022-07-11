export interface BotResponse {
    nlu: any
    result: { text: string, recipient_id: string }[]
    err?: any
}
