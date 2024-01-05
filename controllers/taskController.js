const {
  Task,
  Job,
  User,
  RejectedReason,
  sequence_task,
  sequence,
  sequelize,
  DeviceToken,
  Role,
  Notification,
} = require("../models");
const { Op } = require("sequelize");
const { errorResponse, successResponse } = require("../utils/apiResponse");
const filterSortPaginate = require("../utils/queryUtil");
const { uploadFile, rollbackUploads } = require("../utils/fileUpload");
const parseDate = require("../utils/parseDate");
const sendPushNotification = require("../utils/sendPushNotification");

exports.createTask = async (req, res) => {
  const transaction = await sequelize.transaction();
  let imageFilePath;
  try {
    let {
      heatNo,
      jobId,
      userId,
      estimatedHour,
      description,
      startedAt,
      completedAt,
      approvedAt,
      approvedBy,
      comments,
      status,
      projectManager,
      QCI,
      fitter,
      welder,
      painter,
      foreman,
    } = req.body;

    if (jobId && typeof jobId === "string") {
      const jobIdInt = parseInt(jobId);

      if (!isNaN(jobIdInt)) {
        const job = await Job.findByPk(jobIdInt);

        if (!job) {
          return errorResponse(res, 404, `Job with id ${jobId} not found`);
        }
      }
    }

    if (req.files && req.files.image) {
      const uploadedImage = req.files.image;
      imageFilePath = await uploadFile(uploadedImage, "task_images");
    }

    userId = userId
      ? typeof userId === "string"
        ? JSON.parse(userId)
        : userId
      : null;

    if (startedAt) {
      startedAt = parseDate(startedAt);
    }
    if (completedAt) {
      completedAt = parseDate(completedAt);
    }
    if (approvedAt) {
      approvedAt = parseDate(approvedAt);
    }

    const task = await Task.create(
      {
        heatNo,
        jobId,
        userId,
        estimatedHour,
        description,
        startedAt,
        completedAt,
        approvedAt,
        approvedBy,
        comments,
        image: imageFilePath,
        status,
        projectManager,
        QCI,
        fitter,
        welder,
        painter,
        foreman,
      },
      { transaction }
    );

    await transaction.commit();

    return successResponse(res, 201, { task }, "Task created successfully!");
  } catch (err) {
    console.log(err);
    await transaction.rollback();

    if (imageFilePath) {
      await rollbackUploads(imageFilePath, "task_images");
    }
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.updateTask = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const taskId = req.params.id;
    let task = await Task.findByPk(taskId);

    if (!task) {
      return errorResponse(res, 404, `Task with id ${taskId} not found`);
    }

    let {
      heatNo,
      jobId,
      userId,
      estimatedHour,
      description,
      startedAt,
      completedAt,
      approvedAt,
      approvedBy,
      comments,
      rejectionReason,
      status,
      projectManager,
      QCI,
      fitter,
      welder,
      painter,
      foreman,
    } = req.body;

    const jobIdInt = parseInt(jobId);
    const job = await Job.findByPk(jobIdInt);
    if (!job) {
      return errorResponse(res, 404, `Job with id ${jobIdInt} not found`);
    }

    let image = task.image;

    if (req.files && req.files.image) {
      // Delete previous image file
      if (image) {
        await rollbackUploads(image, "task_images");
      }

      // File upload validation and handling
      try {
        image = await uploadFile(req.files.image, "task_images");
      } catch (err) {
        await transaction.rollback();
        return errorResponse(res, 400, "Error uploading the image", err);
      }
    }

    userId = userId ? JSON.parse(userId) : null;

    if (startedAt) {
      startedAt = parseDate(startedAt);
    }
    if (completedAt) {
      completedAt = parseDate(completedAt);

      const targetRoles = ["Quality Control Inspector", "Project Manager"];

      const usersWithTargetRoles = await User.findAll({
        include: {
          model: Role,
          attributes: ["name"],
          as: "roles",
          where: {
            name: targetRoles, // Use an array to match multiple roles
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
            title: "Task Completed",
            body: `${usersWithTargetRoles[0].firstName} Completed a Task`,
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

    if (approvedAt) {
      approvedAt = parseDate(approvedAt);
    }

    if (rejectionReason) {
      rejectionReason = JSON.stringify(
        Array.isArray(rejectionReason) ? rejectionReason : [rejectionReason]
      );
    } else {
      rejectionReason = "[]";
    }

    await task.update(
      {
        heatNo,
        jobId: jobIdInt,
        userId,
        estimatedHour,
        description,
        startedAt,
        completedAt,
        approvedAt,
        approvedBy,
        comments,
        image,
        rejectionReason,
        status,
        projectManager,
        QCI,
        fitter,
        welder,
        painter,
        foreman,
      },
      { transaction }
    );

    await transaction.commit();

    return successResponse(res, 200, { task }, "Task updated successfully!");
  } catch (err) {
    await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.getAllTask = async (req, res) => {
  try {
    const tasks = await filterSortPaginate(
      Task,
      req.query,
      (includePagination = false)
    );

    if (
      !tasks ||
      (includePagination && (!tasks.data || tasks.data.length === 0))
    ) {
      return successResponse(
        res,
        200,
        {
          tasks: {
            data: [],
          },
        },
        "No tasks found"
      );
    }

    let approvedByIDList;
    let taskData;

    if (includePagination) {
      approvedByIDList = tasks.data.map((task) => task.approvedBy);
      taskData = tasks.data;
    } else {
      approvedByIDList = tasks.map((task) => task.approvedBy);
      taskData = tasks;
    }

    const users = await User.findAll({
      where: {
        id: approvedByIDList,
      },
      attributes: ["id", "firstName", "lastName"],
    });

    const usersMap = users.reduce((map, user) => {
      map[user.id] = `${user.firstName} ${user.lastName}`;
      return map;
    }, {});

    taskData.forEach((task) => {
      const fullName = usersMap[task.approvedBy];
      task.approvedBy = fullName || "";
      if (task.rejectionReason) {
        task.rejectionReason = JSON.parse(task.rejectionReason);
      } else {
        task.rejectionReason = [];
      }
    });
    let Sequences = [];
    if (tasks.length > 0) {
      const job_id = tasks[0].jobId;
      const getsequences = await sequence_task.findAll({
        include: [
          {
            model: sequence,
            attributes: ["sequence_name", "job_id"],
            include: [
              {
                model: Job,
                attributes: ["name"],
              },
            ],
            where: {
              job_id: job_id,
            },
          },
        ],
      });
      Sequences = getsequences.map((sequenceItem) => ({
        sequenceName: sequenceItem.sequence.sequence_name,
        jobId: sequenceItem.sequence.job_id,
        jobName: sequenceItem.sequence.Job.name,
      }));
    }

    const responseData = {
      tasks: {
        data: taskData,
        Sequences,
      },
    };

    if (includePagination) {
      responseData.tasks.count = tasks.count || 0;
      responseData.tasks.currentPage = tasks.currentPage || 0;
      responseData.tasks.perPage = tasks.perPage || 0;
      responseData.tasks.totalPages = tasks.totalPages || 0;
    }

    return successResponse(res, 200, responseData);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 400, "Something went wrong", err);
  }
};

exports.getTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findByPk(taskId);

    if (!task) {
      return successResponse(res, 200, { task: {} }, "No task found");
    }

    let rejectionReasons = task.rejectionReason
      ? JSON.parse(task.rejectionReason)
      : [];

    task.rejectionReason = rejectionReasons;

    const approvedByID = task.approvedBy;

    const user = await User.findOne({
      where: {
        id: approvedByID,
      },
      attributes: ["firstName", "lastName"],
    });

    if (user) {
      const fullName = `${user.firstName} ${user.lastName}`;
      task.approvedBy = fullName;
    } else {
      task.approvedBy = "";
    }

    return successResponse(res, 200, { task });
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.deleteTask = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const taskId = req.params.id;
    const task = await Task.findByPk(taskId);
    if (!task) {
      return successResponse(res, 200, { task: {} }, "No task found");
    }

    // delete image file if it exists
    if (task.image) {
      await rollbackUploads(task.image, "task_images");
    }

    await Task.destroy({ where: { id: taskId } }, { transaction });
    await transaction.commit();

    return successResponse(res, 200, null, "Task deleted successfully!");
  } catch (err) {
    await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.exportTask = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [
        { model: User, attributes: ["firstName", "lastName"] },
        { model: Job, attributes: ["name"] }, // Include the Job model with the 'name' attribute
      ],
    });

    // Modify the tasks array to remove the User object and jobId property, and keep only the userName property
    const modifiedTasks = tasks.map((task) => {
      const { jobId, userId, Job, User, ...taskData } = task.toJSON();
      const userName = User
        ? `${User.firstName || ""} ${User.lastName || ""}`.trim()
        : null;
      taskData.userName = userName !== "" ? userName : null;
      taskData.JobName = task.Job.name; // Add the JobName property
      return taskData;
    });

    return successResponse(res, 200, modifiedTasks);

    // return successResponse(res, 200, tasks);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 400, "Something went wrong", err);
  }
};

exports.approvedTask = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    let { approvedAt, status } = req.body;
    const taskId = req.params.id;
    let task = await Task.findByPk(taskId);

    if (!task) {
      return errorResponse(res, 404, `Task with id ${taskId} not found`);
    }
    approvedAt = parseDate(approvedAt);
    await task.update({ status, approvedAt }, { transaction });

    await transaction.commit();
    return successResponse(res, 200, { task }, "Task approved successfully!");
  } catch (err) {
    await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.rejectedTask = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { status } = req.body;
    const taskId = req.params.id;
    let task = await Task.findByPk(taskId);

    const user = await User.findOne({ where: { id: task.userId } });

    let ratePerHour = user.ratePerHour;

    if (ratePerHour ? ratePerHour : 0);

    if (!task) {
      return errorResponse(res, 404, `Task with id ${taskId} not found`);
    }
    const taskCreationTime = new Date(task.startedAt).getTime();

    const taskCompletionTime = new Date(task.completedAt).getTime();

    const totalCOPQForRejection = taskCompletionTime - taskCreationTime;
    const totalCOPQInHours =
      (totalCOPQForRejection / (1000 * 60 * 60)) * ratePerHour;
    const formattedCOPQ = Number(totalCOPQInHours.toFixed(2));
    const cumulativeCOPQ = parseFloat(task.COPQ) + formattedCOPQ;

    await task.update({ status, COPQ: cumulativeCOPQ }, { transaction });

    await transaction.commit();
    return successResponse(res, 200, { task }, "Task rejected successfully!");
  } catch (err) {
    await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.getRejectedTaskByMonthAndYear = async (req, res) => {
  try {
    // Fetch rejected reasons with parent-child relationships
    const allRejectedReasons = await RejectedReason.findAll();

    const rejectedTasks = await Task.findAll({
      where: {
        status: "rejected",
        completedAt: { [Op.not]: null },
      },
    });

    // Create a mapping of reason IDs to their parent categories
    const reasonIdToParent = {};
    allRejectedReasons.forEach((reason) => {
      if (reason.parentId === null) {
        // This is a parent category
        reasonIdToParent[reason.id] = reason.name;
      }
    });

    // Initialize copqByReason with all parent categories and set their values to 0
    const copqByReason = {};
    Object.values(reasonIdToParent).forEach((parentCategory) => {
      copqByReason[parentCategory] = 0;
    });

    // Perform calculations for COPQ grouped by year and month
    const copqByYear = {};
    const copqByMonth = {};

    await Promise.all(
      rejectedTasks.map(async (task) => {
        const year = task.completedAt.getFullYear().toString();
        const month = (task.completedAt.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        const keyYear = year;
        const keyMonth = month;

        if (task.rejectionReason !== null) {
          const parsedReasons = JSON.parse(task.rejectionReason);

          await Promise.all(
            parsedReasons.map(async (reasonName) => {
              // Find the reason in the RejectedReason table
              const reason = await RejectedReason.findOne({
                where: { name: reasonName },
              });

              if (reason) {
                const parentCategory = reasonIdToParent[reason.parentId];

                if (parentCategory) {
                  copqByReason[parentCategory] += parseFloat(task.COPQ);
                }
              }
            })
          );
        }

        if (!copqByYear[keyYear]) {
          copqByYear[keyYear] = 0;
        }
        if (!copqByMonth[keyMonth]) {
          copqByMonth[keyMonth] = 0;
        }

        copqByYear[keyYear] += parseFloat(task.COPQ);
        copqByMonth[keyMonth] += parseFloat(task.COPQ);
      })
    );

    Object.keys(copqByReason).forEach((reason) => {
      copqByReason[reason] = copqByReason[reason].toFixed(2);
    });

    // Convert the totals to strings with 2 decimal places
    Object.keys(copqByYear).forEach((key) => {
      copqByYear[key] = copqByYear[key].toFixed(2);
    });

    Object.keys(copqByMonth).forEach((key) => {
      copqByMonth[key] = copqByMonth[key].toFixed(2);
    });

    const analytics = {
      years: copqByYear,
      months: copqByMonth,
      reasons: copqByReason,
    };

    return successResponse(res, 200, { analytics });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};
