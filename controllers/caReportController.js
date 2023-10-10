const { CAReport, User, SharedReport, sequelize } = require("../models");
const { errorResponse, successResponse } = require("../utils/apiResponse");

const filterSortPaginate = require("../utils/queryUtil");
const parseDate = require("../utils/parseDate");

exports.createCAReort = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    let {
      originatorName,
      contractorSupplier,
      caReportDate,
      ncNo,
      purchaseOrderNo,
      partDescription,
      partId,
      quantity,
      dwgNo,
      activityFound,
      description,
      actionToPrevent,
      disposition,
      responsiblePartyName,
      responsiblePartyDate,
      correctiveActionDesc,
      approvalName,
      approvalDate,
      userId,
    } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return successResponse(res, 200, {}, "No user found");
    }

    caReportDate = parseDate(caReportDate);
    approvalDate = parseDate(approvalDate);
    responsiblePartyDate = parseDate(responsiblePartyDate);

    quantity = parseInt(quantity);

    const caReport = await CAReport.create(
      {
        originatorName,
        contractorSupplier,
        caReportDate,
        ncNo,
        purchaseOrderNo,
        partDescription,
        partId,
        quantity,
        dwgNo,
        activityFound: activityFound ? JSON.stringify(activityFound) : null,
        description,
        actionToPrevent,
        disposition,
        responsiblePartyName,
        responsiblePartyDate,
        correctiveActionDesc,
        approvalName,
        approvalDate,
        userId,
      },
      { transaction }
    );

    await transaction.commit();
    return successResponse(
      res,
      200,
      { caReport },
      "Report created successfully!"
    );
  } catch (err) {
    console.log(err);
    await transaction.rollback();
    return errorResponse(res, 500, "Something went wrong!", err);
  }
};

exports.updateCAReport = async (req, res) => {
  const transaction = await sequelize.transaction();

  const caReportId = req.params.id;

  try {
    const {
      originatorName,
      contractorSupplier,
      caReportDate,
      ncNo,
      purchaseOrderNo,
      partDescription,
      partId,
      quantity,
      dwgNo,
      activityFound,
      description,
      actionToPrevent,
      disposition,
      responsiblePartyName,
      responsiblePartyDate,
      correctiveActionDesc,
      approvalName,
      approvalDate,
      userId,
    } = req.body;

    const caReport = await CAReport.findByPk(caReportId);

    if (!caReport) {
      return successResponse(res, 404, { caReport: {} }, "No CA Report found");
    }

    await caReport.update(
      {
        originatorName,
        contractorSupplier,
        caReportDate: parseDate(caReportDate),
        ncNo,
        purchaseOrderNo,
        partDescription,
        partId,
        quantity,
        dwgNo,
        activityFound: activityFound ? JSON.stringify(activityFound) : null,
        description,
        actionToPrevent,
        disposition,
        responsiblePartyName,
        responsiblePartyDate,
        correctiveActionDesc,
        approvalName,
        approvalDate: parseDate(approvalDate),
        userId,
      },
      { transaction }
    );

    await transaction.commit();
    return successResponse(
      res,
      200,
      { caReport },
      "Report updated successfully!"
    );
  } catch (err) {
    console.log(err);
    await transaction.rollback();
    return errorResponse(res, 500, "Something went wrong!", err);
  }
};

exports.getCAReport = async (req, res) => {
  try {
    const caReportId = req.params.id;

    const caReport = await CAReport.findByPk(caReportId);

    if (!caReport) {
      return successResponse(res, 404, { caReport: {} }, "No CA Report found");
    }

    return successResponse(res, 200, { caReport });
  } catch (err) {
    console.log(err);
    return errorResponse(res, 500, "Something went wrong!", err);
  }
};

exports.getAllCAReports = async (req, res) => {
  try {
    const caReports = await filterSortPaginate(
      CAReport,
      req.query,
      (includePagination = true)
    );

    if (!caReports || caReports.length === 0 || caReports.count === 0) {
      return successResponse(
        res,
        200,
        { caReports: { data: [] } },
        "No CA Reports found"
      );
    }

    return successResponse(res, 200, { caReports });
  } catch (err) {
    console.log(err);
    return errorResponse(res, 500, "Something went wrong!", err);
  }
};

exports.deleteCAReport = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const caReportId = req.params.id;

    const caReport = await CAReport.findByPk(caReportId);

    if (!caReport) {
      return successResponse(res, 404, { caReport: {} }, "No CA Report found");
    }

    await caReport.destroy({ transaction });
    await transaction.commit();

    return successResponse(res, 200, {}, "CA Report deleted successfully!");
  } catch (err) {
    console.log(err);
    await transaction.rollback();
    return errorResponse(res, 500, "Something went wrong!", err);
  }
};

exports.createSharedReport = async (req, res) => {
  const transaction = await sequelize.transaction();
  const { userId, reportId } = req.body;

  try {
    const users = await User.findAll({
      where: { id: userId },
    });

    if (users.length === 0) {
      return successResponse(res, 200, {}, "No users found");
    }

    const report = await CAReport.findByPk(reportId);

    if (!report) {
      return successResponse(res, 200, {}, "No report found");
    }

    const sharedReports = users.map((user) => ({
      userId: user.id,
      reportId,
    }));

    const createdSharedReports = await SharedReport.bulkCreate(sharedReports, {
      transaction,
    });

    await transaction.commit();
    return successResponse(
      res,
      200,
      { sharedReports: createdSharedReports },
      "Reports shared successfully!"
    );
  } catch (err) {
    return errorResponse(res, 500, "Something went wrong!", err);
  }
};

exports.getSharedReportsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return successResponse(res, 200, {}, "No user found");
    }

    const sharedReports = await SharedReport.findAll({
      where: { userId },
      include: [
        {
          model: CAReport,
          attributes: {
            exclude: ["userId", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["userId", "reportId", "createdAt", "updatedAt"],
      },
    });

    const reports = sharedReports.map((report) => report.CAReport);

    return successResponse(
      res,
      200,
      { sharedReports: reports },
      "Shared reports retrieved successfully!"
    );
  } catch (err) {
    console.log(err);
    return errorResponse(res, 500, "Something went wrong!", err);
  }
};



exports.updateReportStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  const { reportId } = req.params;
  const { status } = req.body;
  try {
    const caReport = await CAReport.findByPk(reportId);

    if (!caReport) {
      return successResponse(res, 404, { caReport: {} }, "Report not found");
    }
    await caReport.update(
      {
        status,
      },
      { transaction }
    );

    await transaction.commit();
    return successResponse(
      res,
      200,
      { caReport },
      "Report status updated successfully!"
    );
  } catch (err) {
    console.log(err);
    await transaction.rollback();
    return errorResponse(res, 500, "Something went wrong!", err);
  }
};