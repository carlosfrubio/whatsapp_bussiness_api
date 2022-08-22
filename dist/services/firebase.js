"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const path = require("../constans/fb");
const serviceAccount = require(path.serviceAccount);
const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "axonproduction2.appspot.com",
});
exports.default = firebaseAdmin;
//# sourceMappingURL=firebase.js.map