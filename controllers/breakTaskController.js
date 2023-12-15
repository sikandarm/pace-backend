const { errorResponse, successResponse } = require("../utils/apiResponse");
const { breaktasks, Task, sequelize } = require("../models");

const setbreaktask = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { break_start, break_end, comment, taskid } = req.body;
    if (break_start) {
      const checkstartbreak = await breaktasks.findAll({
        where: {
          task_id: taskid,
          break_end: null,
        },
      });
      if (checkstartbreak.length > 0) {
        const data = null;
        return successResponse(res, 200, data, "Break Already Start");
      }

      const setstartdate = await breaktasks.create(
        {
          task_id: taskid,
          break_start: break_start,
          break_end: null,
          comment: comment,
          createdBy: req.user.id,
        },
        { transaction }
      );
      await transaction.commit();
      const modifiedres = {
        id: setstartdate.id,
        task_id: setstartdate.task_id,
        break_start: setstartdate.break_start,
        break_end: setstartdate.break_end,
        comment: setstartdate.comment,
      };
      if (setstartdate) {
        return successResponse(res, 200, modifiedres, "Break Start");
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
      const modifiedres = {
        id: setenddate.id,
        task_id: setenddate.task_id,
        break_start: setenddate.break_start,
        break_end: setenddate.break_end,
        comment: setenddate.comment,
      };
      if (setenddate) {
        return successResponse(res, 200, modifiedres, "Break End");
      }
    }
  } catch (error) {
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};

const breakstatus = async (req, res) => {
  try {
    const { id } = req.params;
    const status = await breaktasks.findAll({
      where: {
        task_id: id,
        break_end: null,
      },
    });
    // if (status.length == 0) {
    //   return successResponse(res, 200, "Not Break Found");
    // }
    if (status[0]?.break_start) {
      return successResponse(res, 200, true);
    } else {
      return successResponse(res, 200, false);
    }
  } catch (error) {
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};

const breaktasklogs = async (req, res) => {
  try {
    const { id } = req.params;
    const logs = await breaktasks.findAll({
      where: {
        task_id: id,
      },
    });

    const modifieddata = logs.map((items) => ({
      id: items.id,
      task_id: items.task_id,
      break_start: items.break_start,
      break_end: items.break_end,
      comment: items.comment,
    }));

    if (logs) {
      return successResponse(res, 200, modifieddata, "Break Task Logs");
    } else {
      return successResponse(res, 200, "Not Found Break Task Logs");
    }
  } catch (error) {
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};

module.exports = {
  setbreaktask,
  breakstatus,
  breaktasklogs,
};
