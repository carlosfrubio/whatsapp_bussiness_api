import * as admin from "firebase-admin";

const path = require("../constans/fb");
const serviceAccount = require(path.serviceAccount);

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "axonproduction2.appspot.com",
});

export default firebaseAdmin;
