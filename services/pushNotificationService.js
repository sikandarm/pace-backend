const Queue = require("bull");
const sendPushNotification = require("../utils/sendPushNotification");

// Create a new queue named "pushNotificationQueue"
const pushNotificationQueue = new Queue("pushNotificationQueue", {
  // Set the number of retries to 3 (adjust as needed)
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000, // Initial delay in milliseconds
    },
  },
});

// Define the queue processing function
pushNotificationQueue.process(async (job) => {
  console.log("here ", job.data);
  const { registrationTokens, payload } = job.data;

  try {
    console.log("i am here frompush notification service");
    await sendPushNotification(registrationTokens, payload);
    console.log(`Push notification job ${job.id} completed successfully.`);
  } catch (error) {
    console.error(
      `Push notification job ${job.id} failed. Error: ${error.message}`
    );
    // If the error is due to invalid registration tokens, you can remove them from the database
    if (error.code === "messaging/invalid-registration-token") {
      console.warn(
        `Removing invalid registration tokens: ${registrationTokens}`
      );
      // Your code to remove invalid tokens from the database goes here
    }
    // Throw the error to allow the Bull queue to retry the job if necessary
    throw error;
  }
});

pushNotificationQueue.on("completed", (job, result) => {
  console.log(`Push notification job ${job.id} completed. Result: ${result}`);
});

module.exports = pushNotificationQueue;
