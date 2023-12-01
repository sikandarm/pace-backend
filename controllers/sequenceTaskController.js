const { errorResponse, successResponse } = require("../utils/apiResponse");
const { sequence_task, sequence, Task, sequelize, Job } = require("../models");

const getsequencetask = async (req, res) => {
  try {
    const { id } = req.params;
    const whereClause = {
      deletedAt: null,
    };

    const sequencetasklist = await sequence_task.findAll({
      include: [
        {
          model: sequence,
          attributes: ["id", "sequence_name", "job_id"],
          include: [
            {
              model: Job,
              attributes: ["name"],
            },
          ],
          where: {
            job_id: id,
          },
        },
        {
          model: Task,
        },
      ],
      where: whereClause,
    });

    const groupedSequences = sequencetasklist.reduce((acc, item) => {
      const sequenceName = item.sequence.sequence_name;
      const sequenceid = item.sequence.id;
      const task = {
        id: item.Task.id,
        PmkNumber: item.Task.pmkNumber,
        description: item.Task.description,
        status: item.Task.status,
        startedAt: item.Task.startedAt,
        completedAt: item.Task.completedAt,
      };

      if (!acc[sequenceName]) {
        acc[sequenceName] = {
          sequence: {
            SequenceId: sequenceid,
            JobId: id,
            sequenceName,
            tasks: [],
          },
        };
      }

      acc[sequenceName].sequence.tasks.push(task);

      return acc;
    }, {});

    const modifiedResponse = Object.values(groupedSequences);

    if (modifiedResponse.length > 0) {
      return successResponse(res, 200, modifiedResponse, "Sequences");
    } else {
      return successResponse(res, 404, "Sequences Not Found");
    }
  } catch (error) {
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};

const updatesequencetask = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { sequence_id, task_id } = req.body;
    const whereCluse = {
      deletedAt: null,
    };
    if (sequence_id == null && task_id == null) {
      return errorResponse(res, 200, "Data can't be Null");
    }

    const existingSequence = await sequence_task.findOne({
      where: {
        sequence_id: sequence_id,
        task_id: task_id,
        ...whereCluse,
      },
    });

    if (existingSequence) {
      await existingSequence.update({ deletedAt: new Date() }, { transaction });
    }

    const createsequencetask = await sequence_task.create(
      {
        sequence_id: sequence_id,
        task_id: task_id,
        createdBy: req.user.id,
      },
      { transaction }
    );

    await transaction.commit();

    if (createsequencetask) {
      return successResponse(
        res,
        201,
        createsequencetask,
        "SequenceTask created successfully"
      );
    } else {
      return errorResponse(res, 200, "SequenceTask not created");
    }
  } catch (error) {
    await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};

const getIndependentTasks = async (req, res) => {
  try {
    const { id } = req.params;

    const tasksInSequence = await sequence_task.findAll({
      attributes: ["task_id"],
    });

    const taskIdsInSequence = tasksInSequence.map((task) => task.task_id);

    const independentTasks = await Task.findAll({
      where: 
         [
          sequelize.literal(`id NOT IN (${taskIdsInSequence.join(",")})`),
          { jobId: id },
        ],
      
    });

    if (independentTasks.length > 0) {
      return successResponse(res, 200, independentTasks, "Independent Tasks");
    } else {
      return successResponse(
        res,
        404,
        independentTasks,
        "No Independent Tasks Found"
      );
    }
  } catch (error) {
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};

module.exports = {
  getsequencetask,
  updatesequencetask,
  getIndependentTasks,
};