const admin = require("firebase-admin");

const serviceAccount = require("./ecotrack-b415d-firebase-adminsdk-fbsvc-3a26dd363f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
