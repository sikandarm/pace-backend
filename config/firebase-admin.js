const admin = require("firebase-admin");
const serviceAccount = require("../firebase.json"); // Path to your downloaded service account JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Add other initialization options as required
});

// Export the initialized admin object
module.exports = admin;


