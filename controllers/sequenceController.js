const { errorResponse, successResponse } = require("../utils/apiResponse");
const { Job, sequence, sequelize } = require("../models");

const getsequence = async (req, res) => {
  try {
    const { id } = req.params;
    const whereCluse = {
      deletedAt: null,
    };
    const listsequence = await sequence.findAll({
      where: {
        job_id: id,
        ...whereCluse,
      },
      include: [
        {
          model: Job,
          attributes: ["name"],
        },
      ],
    });
    const Itemsdata = listsequence.map((item) => ({
      id: item.id,
      sequence_name: item.sequence_name,
      Job: item.Job.name,
    }));

    if (Itemsdata.length > 0) {
      return successResponse(res, 200, { sequence: Itemsdata }, "Sequences");
    } else {
      return successResponse(res, 200, "Not Found Sequences");
    }
  } catch (error) {
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};

const createsequencete = async (req, res) => {
  // const transaction = await sequelize.transaction();
  try {
    const { sequence_name, job_id } = req.body;
    if (job_id == null) {
      return errorResponse(res, 200, "Job can't be Null");
    }
    const existingSequence = await sequence.findOne({
      where: {
        sequence_name: sequence_name,
        job_id: job_id,
        deletedAt: null,
      },
    });

    if (existingSequence) {
      return errorResponse(
        res,
        200,
        "Sequence with the same name and job already exists"
      );
    }
    const createsequences = await sequence.create(
      {
        sequence_name: sequence_name,
        job_id: job_id,
        createdBy: req.user.id,
      },
      { include: Job }
    );
    // await transaction.commit();
    if (createsequences) {
      const response = await sequence.findByPk(createsequences.id, {
        include: {
          model: Job,
        },
      });
      const createsequence = {
        id: response.id,
        sequence_name: response.sequence_name,
        Job: response.Job ? response.Job.name : null,
        message: "Sequence created successfully!",
      };
      return successResponse(
        res,
        201,
        { createsequence },
        "Sequence created successfully"
      );
    } else {
      return errorResponse(res, 200, "Sequence not created");
    }
  } catch (error) {
    // await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};

const deletesequencete = async (req, res) => {
  try {
    const { id } = req.params;
    const getsequence = await sequence.findByPk(id);
    if (!getsequence) {
      return successResponse(res, 200, { getsequence }, "No Sequence found");
    }
    // Check if the purchase order has already been deleted
    if (getsequence.deletedAt === null) {
      getsequence.deletedBy = req.user.id;
      getsequence.deletedAt = new Date();
      await getsequence.save();

      return successResponse(
        res,
        200,
        { getsequence },
        "Sequence deleted successfully"
      );
    } else {
      return successResponse(
        res,
        200,
        { getsequence },
        "Sequence is already deleted"
      );
    }
  } catch (err) {
    return errorResponse(res, 500, "Error while Deleting Sequence", err);
  }
};

const getallSequences = async (req, res) => {
  try {
    const listsequence = await sequence.findAll({
      where: {
        deletedAt: null,
      },
      include: [
        {
          model: Job,
          attributes: ["id", "name"],
        },
      ],
    });
    const Itemsdata = listsequence.map((item) => ({
      id: item.id,
      sequence_name: item.sequence_name,
      Job: item.Job.name,
      jobid: item.Job.id,
    }));
    if (Itemsdata.length > 0) {
      return successResponse(res, 200, { sequence: Itemsdata }, "Sequences");
    } else {
      return successResponse(res, 200, "Not Found Sequences");
    }
  } catch (error) {
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};

const updatesequencete = async (req, res) => {
  // const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { sequence_name, job_id } = req.body;
    if (job_id == null) {
      return errorResponse(res, 200, "Job can't be Null");
    }
    const existingSequence = await sequence.findOne({
      where: {
        sequence_name: sequence_name,
        job_id: job_id,
        deletedAt: null,
      },
    });

    if (existingSequence) {
      return errorResponse(
        res,
        200,
        "Sequence with the same name and job already exists"
      );
    }
    const updatedata = await sequence.findByPk(id);

    const updatessequences = await updatedata.update(
      {
        sequence_name: sequence_name,
        job_id: job_id,
        updatedBy: req.user.id,
      },
      { include: Job }
    );
    // await transaction.commit();
    if (updatessequences) {
      const response = await sequence.findByPk(updatessequences.id, {
        include: {
          model: Job,
        },
      });
      const updatesequence = {
        id: response.id,
        sequence_name: response.sequence_name,
        Job: response.Job ? response.Job.name : null,
        message: "Sequence Update successfully!",
      };
      return successResponse(
        res,
        201,
        { updatesequence },
        "Sequence Update successfully"
      );
    } else {
      return errorResponse(res, 200, "Sequence not Update");
    }
  } catch (error) {
    // await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};
module.exports = {
  getsequence,
  createsequencete,
  deletesequencete,
  getallSequences,
  updatesequencete,
};
