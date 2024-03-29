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

    const dates = new Date(date);

    // Format the date to "MMM DD, YYYY"
    const formattedDate = dates.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const htmlContent = generateHtmlFromFormData(
      requestedof,
      attn,
      project,
      reference,
      RFI_N,
      OF,
      formattedDate,
      cc,
      information,
      suggestions
    );
    const pdfBuffer = await generatePdfFromHtml(htmlContent);
    const emailResponse = await sendEmail(pdfBuffer);

    if (emailResponse === "Email sent successfully") {
      return successResponse(res, 200, "RFI sent successfully!");
    } else {
      return successResponse(res, 200, "RFI  NOT Sent!");
    }
  } catch (error) {
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};

module.exports = {
  sendmail,
};
