const { Notification, sequelize } = require("../models");
const { errorResponse, successResponse } = require("../utils/apiResponse");

const filterSortPaginate = require("../utils/queryUtil");

exports.getAllNotification = async (req, res) => {
  try {
    const notifications = await filterSortPaginate(
      Notification,
      req.query,
      (includePagination = false)
    );

    if (
      !notifications ||
      notifications.length === 0 ||
      notifications.count === 0
    ) {
      return successResponse(
        res,
        200,
        { notifications: { data: [] } },
        "No notifications found"
      );
    }

    return successResponse(res, 200, { notifications });
  } catch (err) {
    console.log(err);
    return errorResponse(res, 500, "Something went wrong!", err);
  }
};
