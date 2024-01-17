const { errorResponse, successResponse } = require("../utils/apiResponse");
const {
  breaktasks,
  Task,
  sequelize,
  DeviceToken,
  Role,
  Notification,
  User,
} = require("../models");
const sendPushNotification = require("../utils/sendPushNotification");
const { formatTime } = require("../utils/timeConverter");
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

      const task = await Task.findByPk(taskid);

      const setstartdate = await breaktasks.create(
        {
          task_id: taskid,
          break_start: break_start,
          break_end: null,
          comment: comment,
          task_status: task.status,
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
        const usersWithTargetRoles = await User.findAll({
          include: {
            model: Role,
            attributes: ["name"],
            as: "roles",
            where: {
              name: "Shop Foreman",
            },
          },
        });
        const taskdata = await Task.findAll({
          where: {
            id: taskid,
          },
        });
        // Use a Set to collect unique user IDs
        const targetUserIdsSet = new Set();
        usersWithTargetRoles.forEach((user) => {
          targetUserIdsSet.add(user.id);
        });

        const targetUserIds = Array.from(targetUserIdsSet);

        const managerTokens = await DeviceToken.findAll({
          where: { userId: targetUserIds },
        });

        // Filter out empty or invalid tokens from the array
        const validManagerTokens = managerTokens
          .map((token) => token.token)
          .filter((token) => typeof token === "string" && token.trim() !== "");

        if (validManagerTokens.length > 0) {
          const registrationTokens = validManagerTokens;
          const payload = {
            notification: {
              title: "Task Start",
              body: `pmkNumber# ${taskdata[0]?.pmkNumber} Task Started`,
            },
          };

          // await pushNotificationQueue.add({ registrationTokens, payload });
          await sendPushNotification(registrationTokens, payload);

          const notifications = targetUserIds.map((userId) => ({
            title: payload.notification.title,
            body: payload.notification.body,
            userId,
          }));
          await Notification.bulkCreate(notifications);
        }

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
      if (setenddate) {
        const prvData2 = await breaktasks.findAll({
          where: {
            task_id: taskid,
          },
        });

        for (const breakTask of prvData2) {
          const time1 = new Date(breakTask.break_start).getTime();
          const time2 = new Date(breakTask.break_end).getTime();
          const totaltime = time2 - time1;
          // console.log(totaltime);
          const time = formatTime(totaltime);
          await breakTask.update({
            total_time: time,
          });
        }
      }
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
