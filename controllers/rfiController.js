const { errorResponse, successResponse } = require("../utils/apiResponse");
const { sendEmail } = require("../config/mailer");
const { uploadFiles } = require("../utils/fileUpload");
const { rfiresponse } = require("../models");
const filterSortPaginate = require("../utils/queryUtil");

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
    const formattedDate = dates
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      .replace(",", "");

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

const uploadfile = async (req, res) => {
  try {
    const file = req.files.file;

    const upload_data = await uploadFiles(file, "rfi_reports");

    if (upload_data) {
      const saveData = await rfiresponse.create({
        file: upload_data[0]?.fileName,
      });

      if (saveData) {
        return successResponse(
          res,
          200,
          upload_data,
          "RFI Response Upload successfully!"
        );
      } else {
        return errorResponse(res, 400, "Failed to save file in database");
      }
    } else {
      return errorResponse(res, 400, "Failed to upload file");
    }
  } catch (error) {
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};

const getUploadFile = async (req, res) => {
  try {
    const file = await filterSortPaginate(
      rfiresponse,
      req.query,
      (includePagination = false)
    );

    if (
      !file ||
      (includePagination && (!file.data || file.data.length === 0))
    ) {
      return successResponse(
        res,
        200,
        {
          file: {
            data: [],
          },
        },
        "No File found"
      );
    }

    if (includePagination) {
      responseData.file.count = file.count || 0;
      responseData.file.currentPage = file.currentPage || 0;
      responseData.file.perPage = file.perPage || 0;
      responseData.file.totalPages = file.totalPages || 0;
    }

    return successResponse(res, 200, file);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 400, "Something went wrong", err);
  }
};

const deleteUploadFIle = async (req, res) => {
  const fileId = req.params.id;
  try {
    const ress = await rfiresponse.findByPk(fileId);

    if (!ress) {
      return successResponse(
        res,
        200,
        { Response: {} },
        "No RFI Response found"
      );
    }

    const deleted = await ress.destroy();

    if (deleted) {
      return successResponse(
        res,
        200,
        null,
        "RFI Response deleted successfully"
      );
    }

    return errorResponse(res, 400, "Failed to delete!");
  } catch (err) {
    return errorResponse(res, 500, "Error while deleting", err);
  }
};
module.exports = {
  sendmail,
  uploadfile,
  getUploadFile,
  deleteUploadFIle,
};
