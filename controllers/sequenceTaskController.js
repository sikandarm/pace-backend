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
        //  sequence_id: sequence_id,
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
    const whereClause = {
      deletedAt: null,
    };
    let independentTasks;
    const tasksInSequence = await sequence_task.findAll({
      where: whereClause,
      attributes: ["task_id"],
    });

    const taskIdsInSequence = tasksInSequence.map((task) => task.task_id);

    if (taskIdsInSequence.length > 0) {
      independentTasks = await Task.findAll({
        where: [
          sequelize.literal(`id NOT IN (${taskIdsInSequence.join(",")})`),
          { jobId: id },
          // whereClause,
        ],
      });
    } else {
      independentTasks = await Task.findAll({
        where: [
          // sequelize.literal(`id NOT IN (${taskIdsInSequence.join(",")})`),
          { jobId: id },
          // whereClause,
        ],
      });
    }

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

const getnoassignsequence = async (req, res) => {
  try {
    const { id } = req.params;
    let independentseq;
    const InSequence = await sequence_task.findAll({
      where: {
        deletedAt: null,
      },
      attributes: ["sequence_id"],
    });
    const taskIdsInSequence = InSequence.map((seq) => seq.sequence_id);

    if (taskIdsInSequence.length > 0) {
      independentseq = await sequence.findAll({
        where: [
          sequelize.literal(`id NOT IN (${taskIdsInSequence.join(",")})`),
          { job_id: id },
          { deletedAt: null },
        ],
      });
    } else {
      independentseq = await sequence.findAll({
        where: [
          // sequelize.literal(`id NOT IN (${taskIdsInSequence.join(",")})`),
          { job_id: id },
          { deletedAt: null },
        ],
      });
    }

    const modifiedIndependentSeq = independentseq.map((seq) => ({
      id: seq.id,
      sequence_name: seq.sequence_name,
      job_id: seq.job_id,
      task: [],
    }));

    const respose = {
      sequences: modifiedIndependentSeq,
    };

    if (independentseq.length > 0) {
      return successResponse(res, 200, respose, "Not Assign Sequence");
    } else {
      return successResponse(res, 404, "Not Assign Empty Sequence");
    }
  } catch (error) {
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};

const getsequencebyid = async (req, res) => {
  try {
    const { id } = req.params;
    const sequencetask = await sequence_task.findAll({
      where: {
        sequence_id: id,
      },
      include: [
        {
          model: Task,
          attributes: ["pmkNumber"],
        },
        {
          model: sequence,
          attributes: ["sequence_name", "job_id"],
        },
      ],
    });
    const modifieddata = sequencetask.map((items) => ({
      id: items.id,
      sequenceid: items.sequence_id,
      taskid: items.task_id,
      TaskName: items.Task.pmkNumber,
      SequenceName: items.sequence.sequence_name,
      jobid: items.sequence.job_id,
    }));
    if (modifieddata) {
      return successResponse(res, 200, modifieddata, "SequenceTasks");
    }
  } catch (error) {
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};

// const getIndependentTasksbyseqid = async (req, res) => {
//   try {
//     const { id } = req.params;
//     let independentTasks;
//     const tasksInSequence = await sequence_task.findAll({
//       where: {
//         sequence_id: id,
//       },
//       attributes: ["task_id"],
//     });

//     const taskIdsInSequence = tasksInSequence.map((task) => task.task_id);
//     console.log(taskIdsInSequence, "_+_+_+_+_+");
//     if (taskIdsInSequence.length > 0) {
//       independentTasks = await Task.findAll({
//         where: [
//           sequelize.literal(`id NOT IN (${taskIdsInSequence.join(",")})`),
//         ],
//       });
//     }

//     if (independentTasks.length > 0) {
//       return successResponse(res, 200, independentTasks, "Independent Tasks");
//     } else {
//       return successResponse(
//         res,
//         404,
//         independentTasks,
//         "No Independent Tasks Found"
//       );
//     }
//   } catch (error) {
//     return errorResponse(res, 400, "Something went wrong!", error);
//   }
// };

const deletesequencetask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedata = await sequence_task.findAll({
      where: {
        task_id: id,
        deletedAt: null,
      },
    });

    const deleted = await deletedata[0]?.update({
      deletedAt: new Date(),
      deletedBy: req.user.id,
    });

    if (deleted) {
      return successResponse(res, 200, "SequenceTasks Deleted");
    }
  } catch (error) {
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};

module.exports = {
  getsequencetask,
  updatesequencetask,
  getIndependentTasks,
  getnoassignsequence,
  getsequencebyid,
  deletesequencetask,
  // getIndependentTasksbyseqid,
};
