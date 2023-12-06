const { errorResponse, successResponse } = require("../utils/apiResponse");
const { breaktasks, Task, sequelize } = require("../models");

const setbreaktask = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { break_start, break_end, taskid } = req.body;
    if (break_start) {
      const checkstartbreak = await breaktasks.findAll({
        where: {
          task_id: taskid,
          break_end: null,
        },
      });
      if (checkstartbreak.length > 0) {
        return successResponse(res, 200, "Break Already Start");
      }

      const setstartdate = await breaktasks.create(
        {
          task_id: taskid,
          break_start: break_start,
          createdBy: req.user.id,
        },
        { transaction }
      );
      await transaction.commit();
      if (setstartdate) {
        return successResponse(res, 200, setstartdate, "Break Start");
      }
    }
    if (break_end) {
      const breakdata = await breaktasks.findAll({
        where: {
          task_id: taskid,
          break_end: null,
        },
      });
      const prvData = await breaktasks.findByPk(breakdata[0]?.id);
      if (!prvData) {
        return successResponse(
          res,
          200,
          prvData,
          "Not End Break First Start Break"
        );
      }
      const setenddate = await prvData.update({
        task_id: taskid,
        break_end: break_end,
      });
      if (setenddate) {
        return successResponse(res, 200, setenddate, "Break End");
      }
    }
  } catch (error) {
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};

module.exports = {
  setbreaktask,
};
