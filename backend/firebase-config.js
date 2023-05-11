const admin = require("firebase-admin");
const dotenv = require('dotenv');
dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_CONFIG);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
