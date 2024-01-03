const { errorResponse, successResponse } = require("../utils/apiResponse");
const { sendEmail } = require("../config/mailer");
const {
  generateHtmlFromFormData,
  generatePdfFromHtml,
} = require("../config/genratePDF");

const sendmail = async (req, res) => {
  try {
    const {
      requestedof,
      attn,
      project,
      reference,
      RFI_N,
      OF,
      date,
      cc,
      information,
      suggestions,
    } = req.body.formData;

    const htmlContent = generateHtmlFromFormData(
      requestedof,
      attn,
      project,
      reference,
      RFI_N,
      OF,
      date,
      cc,
      information,
      suggestions
    );
    const pdfBuffer = await generatePdfFromHtml(htmlContent);
    await sendEmail(pdfBuffer);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};

module.exports = {
  sendmail,
};
