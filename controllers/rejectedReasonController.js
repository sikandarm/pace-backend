const { RejectedReason } = require("../models");
const { errorResponse, successResponse } = require("../utils/apiResponse");

exports.getAllReasons = async (req, res) => {
  try {
    const reasons = await RejectedReason.findAll({
      include: [
        {
          model: RejectedReason,
          as: "children",
          attributes: ["id", "name", "parentId"],
        },
      ],
      attributes: ["id", "name"],
      where: { parentId: null },
    });
    if (!reasons?.length) {
      return successResponse(res, 200, { reasons: [] }, "No reasons found");
    }
    return successResponse(res, 200, { reasons });
  } catch (err) {
    console.log(err);
    return errorResponse(res, 400, "Something went wrong", err);
  }
};
