const nodemailer = require("nodemailer");
const { Contact } = require("../models");
exports.sendEmail = async (pdfBuffer) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || "gmail",
    auth: {
      user: process.env.SMTP_MAIL || "pacep8633@gmail.com",
      pass: process.env.SMTP_PASS || "zexyoyycvhpdnhea",
    },
  });
  const getAllContacts = async () => {
    try {
      const contacts = await Contact.findAll();
      return contacts;
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  };

  const contacts = await getAllContacts();

  for (const conatct of contacts) {
    const mailOptions = {
      from: "pacep8633@gmail.com",
      to: conatct.email,
      subject: "PDF Submission",
      text: `Please find the attached PDF document.`,
      attachments: [
        {
          filename: "RFI_Request.pdf",
          content: pdfBuffer,
          encoding: "base64",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
  }
};
