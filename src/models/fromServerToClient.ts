// sent
const botSendMessageToClient =  {
    "statuses":[{
        "conversation":{
            "expiration_timestamp":1649955000,
            "id":"f010b60d163c52cccdb9056dd5037169",
            "origin":{"type":"user_initiated"}
        },
        "id":"gBEGVzIUFThWAgks3TAHH0CZtPY",
        "pricing":{"billable":true,"category":"user_initiated","pricing_model":"CBP"},
        "recipient_id":"573214153856",
        "status":"sent",
        "timestamp":"1649869095",
        "type":"message"}]
    }



// delivered
const botSendMessageToClientReadConfirmation = {
    "statuses":[{
        "conversation":{
            "id":"f010b60d163c52cccdb9056dd5037169",
            "origin":{"type":"user_initiated"}},
            "id":"gBEGVzIUFThWAgks3TAHH0CZtPY",
            "pricing":{"billable":true,"category":"user_initiated","pricing_model":"CBP"},
            "recipient_id":"573214153856",
            "status":"delivered",
            "timestamp":"1649869097",
            "type":"message"
        }]
    }


    // Read
    // {"statuses":[{"id":"gBEGVzIUFThWAgks3TAHH0CZtPY","recipient_id":"573214153856","status":"read","timestamp":"1649869311","type":"message"}]}