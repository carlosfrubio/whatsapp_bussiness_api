"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTempPath = exports.StandarCode = exports.AuthErrorCode = exports.DataErrorCode = void 0;
const fs = require("fs");
const path = require("path");
var DataErrorCode;
(function (DataErrorCode) {
    DataErrorCode[DataErrorCode["INCOMPLETE_DATA"] = 400] = "INCOMPLETE_DATA";
    DataErrorCode[DataErrorCode["INVALID"] = 422] = "INVALID";
    DataErrorCode[DataErrorCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    DataErrorCode[DataErrorCode["CONFLICT"] = 409] = "CONFLICT";
})(DataErrorCode = exports.DataErrorCode || (exports.DataErrorCode = {}));
var AuthErrorCode;
(function (AuthErrorCode) {
    AuthErrorCode[AuthErrorCode["ACCESS_TOKEN"] = 401] = "ACCESS_TOKEN";
    AuthErrorCode[AuthErrorCode["PERMISSIONS_FAIL"] = 403] = "PERMISSIONS_FAIL";
})(AuthErrorCode = exports.AuthErrorCode || (exports.AuthErrorCode = {}));
var StandarCode;
(function (StandarCode) {
    StandarCode[StandarCode["OK"] = 200] = "OK";
    StandarCode[StandarCode["OK_NO_CONTENT"] = 204] = "OK_NO_CONTENT";
})(StandarCode = exports.StandarCode || (exports.StandarCode = {}));
const getTempPath = () => {
    const dir = path.join(__dirname, '../tmp/');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    return dir;
};
exports.getTempPath = getTempPath;
//# sourceMappingURL=api.js.map