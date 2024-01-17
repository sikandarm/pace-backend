const admin = require("firebase-admin");
const serviceAccount = require("../config/pace-test-348c2-firebase-adminsdk-o4wty-0b3d5271ba.json"); // Path to your downloaded service account JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Add other initialization options as required
});

// Export the initialized admin object
module.exports = admin;
