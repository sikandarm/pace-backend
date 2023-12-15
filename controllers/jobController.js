const fs = require("fs");
const path = require("path");

const {
  Job,
  Task,
  User,
  Role,
  DeviceToken,
  Notification,
  PurchaseOrder,
  sequelize,
} = require("../models");
const { errorResponse, successResponse } = require("../utils/apiResponse");
const filterSortPaginate = require("../utils/queryUtil");
const parseDate = require("../utils/parseDate");

const sendPushNotification = require("../utils/sendPushNotification");
const pushNotificationQueue = require("../services/pushNotificationService");

exports.createJob = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    let { name, description, startDate, endDate, status } = req.body;

    startDate = parseDate(startDate);
    endDate = parseDate(endDate);

    const job = await Job.create(
      {
        name,
        description,
        startDate,
        endDate,
        status,
      },
      { transaction }
    );

    await transaction.commit();

    return successResponse(res, 201, { job }, "Job created successfully!");
  } catch (err) {
    await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.updateJob = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const jobId = req.params.id;
    const { name, description, startDate, endDate, status } = req.body;
    const user = req.user;

    const job = await Job.findByPk(jobId);

    if (!job) {
      return successResponse(res, 200, { job: {} }, "No job found");
    }

    const previousStatus = job.status;

    await job.update(
      {
        name,
        description,
        startDate: parseDate(startDate),
        endDate: parseDate(endDate),
        status,
      },
      { transaction }
    );

    await transaction.commit();

    if (status !== previousStatus) {
      const targetRolesFilePath = path.join(
        __dirname,
        "../config/targetRoles.json"
      );
      let targetRoles = [];
      try {
        if (fs.existsSync(targetRolesFilePath)) {
          const targetRolesData = fs.readFileSync(targetRolesFilePath, "utf8");
          targetRoles = JSON.parse(targetRolesData);
        }
      } catch (err) {
        console.error("Error while reading targetRoles file:", err);
      }
      const usersWithTargetRoles = await User.findAll({
        include: {
          model: Role,
          as: "roles",
          where: {
            name: targetRoles,
          },
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
            title: "Job Status Updated",
            body: `The status of job ${job.name} has been updated to ${status}`,
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
    }

    return successResponse(res, 200, { job }, "Job updated successfully!");
  } catch (err) {
    if (transaction.finished === "commit") {
      console.log(err);
      return errorResponse(res, 400, "Something went wrong", err);
    }
    console.log(err);
    await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.getAlljob = async (req, res) => {
  try {
    const include = [{ model: Task }, { model: PurchaseOrder }];
    const jobs = await filterSortPaginate(
      Job,
      req.query,
      (includePagination = false),
      include
    );
    if (!jobs || jobs.length === 0 || jobs.count === 0) {
      return successResponse(res, 200, { jobs }, "No jobs found");
    }

    const modifiedJobs = jobs.map((job) => {
      const tasks = job.Tasks;
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(
        (task) => task.status === "approved"
      ).length;
      return {
        id: job.id,
        name: job.name,
        description: job.description,
        status: job.status,
        startDate: job.startDate,
        endDate: job.endDate,
        totalTasks, // only include totalTasks and completedTasks properties
        completedTasks,
        po_id: job.po_id,
      };
    });

    return successResponse(res, 200, { jobs: modifiedJobs });
  } catch (err) {
    console.log(err);
    return errorResponse(res, 400, "Something went wrong", err);
  }
};

exports.getJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findByPk(jobId);

    if (!job) {
      return successResponse(res, 200, { job: {} }, "No job found");
    }

    return successResponse(res, 200, { job });
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.deleteJob = async (req, res) => {
  const transaction = await sequelize.transaction();
  const jobId = req.params.id;
  try {
    const job = await Job.findByPk(jobId);

    if (!job) {
      return successResponse(res, 200, { job: {} }, "No job found");
    }

    const deletedJob = await job.destroy({ transaction });

    if (deletedJob) {
      await transaction.commit(); // Commit the transaction

      return successResponse(res, 200, null, "Job deleted successfully");
    }

    await transaction.rollback(); // Rollback the transaction
    return errorResponse(res, 400, "Failed to delete!");
  } catch (err) {
    await transaction.rollback(); // Rollback the transaction
    return errorResponse(res, 500, "Error while deleting job", err);
  }
};

exports.exportJob = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    return successResponse(res, 200, jobs);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 400, "Something went wrong", err);
  }
};

exports.importJobs = async (req, res) => {
  try {
    const jobsData = req.body;
    const job = await Job.bulkCreate(jobsData);
    return successResponse(res, 200, job, "Jobs imported successfully.");
  } catch (err) {
    console.log(err);
    return errorResponse(res, 400, "Something went wrong", err);
  }
};
