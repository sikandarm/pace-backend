const admin = require("../config/firebase-admin");

async function sendPushNotification(registrationTokens, payload) {
  try {
    const response = await admin.messaging().sendMulticast({
      tokens: registrationTokens,
      ...payload,
    });
    console.log("Successfully sent notifications:", response);
    return response;
  } catch (error) {
    console.error("Error sending notifications:", error);
    throw error;
  }
}

module.exports = sendPushNotification;
