"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialog360 = void 0;
const axios_1 = require("axios");
const config_1 = require("../config");
const dialog360 = async (message) => {
    try {
        const result = await axios_1.default({
            method: 'post',
            url: `https://waba.360dialog.io/v1/messages/`,
            data: { ...message },
            headers: {
                "D360-API-KEY": config_1.config.dialog360Setup.apiKey,
                'Content-Type': 'application/json'
            }
        });
        console.log("RESULT DIALOG", result.data);
        return result.data;
    }
    catch (error) {
        console.log("Error send Message", error);
        throw error;
    }
};
exports.dialog360 = dialog360;
//# sourceMappingURL=360Dialog.js.map