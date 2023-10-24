const admin = require("firebase-admin");
const firebaseConfig = require("./firebase-config.json");
require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  storageBucket: process.env.FIREBASE_STOREAGE_BUCKET,
});

const bucket = admin.storage().bucket();

module.exports = {
  bucket,
};
