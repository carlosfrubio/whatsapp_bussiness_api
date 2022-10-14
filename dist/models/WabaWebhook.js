"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeInteractiveMessage = exports.StatusWhatsapp = exports.TypeMessage = void 0;
var TypeMessage;
(function (TypeMessage) {
    TypeMessage["Text"] = "text";
    TypeMessage["Image"] = "image";
    TypeMessage["Document"] = "document";
    TypeMessage["Audio"] = "audio";
    TypeMessage["Video"] = "video";
    TypeMessage["Location"] = "location";
    TypeMessage["Interactive"] = "interactive";
    TypeMessage["Button"] = "button";
    TypeMessage["Contacts"] = "contacts";
})(TypeMessage = exports.TypeMessage || (exports.TypeMessage = {}));
var StatusWhatsapp;
(function (StatusWhatsapp) {
    StatusWhatsapp["Received"] = "received";
    StatusWhatsapp["Sent"] = "sent";
    StatusWhatsapp["Delivered"] = "delivered";
    StatusWhatsapp["Read"] = "read";
})(StatusWhatsapp = exports.StatusWhatsapp || (exports.StatusWhatsapp = {}));
var TypeInteractiveMessage;
(function (TypeInteractiveMessage) {
    TypeInteractiveMessage["ButtonReply"] = "button_reply";
    TypeInteractiveMessage["ListReply"] = "list_reply";
})(TypeInteractiveMessage = exports.TypeInteractiveMessage || (exports.TypeInteractiveMessage = {}));
//# sourceMappingURL=WabaWebhook.js.map