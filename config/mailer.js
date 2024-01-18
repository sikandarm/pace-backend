const nodemailer = require("nodemailer");
// const { errorResponse, successResponse } = require("../utils/apiResponse");

const { Contact } = require("../models");

exports.sendEmail = async (pdfBuffer) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || "gmail",
    auth: {
      user: process.env.SMTP_MAIL || "pacep8633@gmail.com",
      pass: process.env.SMTP_PASS || "zexyoyycvhpdnhea",
    },
  });

  try {
    const contacts = await Contact.findAll();

    if (!contacts || contacts.length === 0) {
      return "No contacts found";
    }
    const date = new Date(); // Replace this with your actual date

    const options = { year: "numeric", month: "short", day: "2-digit" };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );

    for (const contact of contacts) {
      const mailOptions = {
        from: "pacep8633@gmail.com",
        to: contact.email,
        subject: "RIF",
        text: `Request For Information`,
        attachments: [
          {
            filename: `RFI (${formattedDate}).pdf`,
            content: pdfBuffer,
            encoding: "base64",
          },
        ],
      };

      await transporter.sendMail(mailOptions);
    }

    return "Email sent successfully";
  } catch (error) {
    // console.error("Error sending email:", error);
    return "Error sending email";
  }
};
