"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhonesModel = void 0;
const mongoose_1 = require("mongoose");
const phonesModel = new mongoose_1.Schema({
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
exports.PhonesModel = mongoose_1.model("PhonesModel", phonesModel, "phones");
//# sourceMappingURL=wabaModel.js.map