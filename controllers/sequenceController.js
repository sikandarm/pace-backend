const { errorResponse, successResponse } = require("../utils/apiResponse");
const { Job, sequence, sequelize } = require("../models");

const getsequence = async (req, res) => {
  try {
    const { id } = req.params;
    const whereCluse = {
      deletedAt : null
    }
    const listsequence = await sequence.findAll({
      where: {
        job_id: id,
        ...whereCluse
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
  const transaction = await sequelize.transaction();
  try {
    const { sequence_name, job_id } = req.body;
    if(job_id == null){
     return errorResponse(res, 200, "Job can't be Null");

    }
     const existingSequence = await sequence.findOne({
       where: {
         sequence_name: sequence_name,
         job_id: job_id,
       },
     });

     if (existingSequence) {
       return errorResponse(
         res,
         200,
         "Sequence with the same name and job already exists"
       );
     }
    const createsequence = await sequence.create(
      {
        sequence_name: sequence_name,
        job_id: job_id,
        createdBy: req.user.id,
      },
      { transaction }
    );
    await transaction.commit();
   if (createsequence) {
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
    await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};

const deletesequencete = async (req ,res) =>{
 try {
   const {id} = req.params;
   const getsequence = await sequence.findByPk(id);
   if (!getsequence) {
     return successResponse(
       res,
       200,
       { getsequence },
       "No Sequence found"
     );
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

}
module.exports = {
  getsequence,
  createsequencete,
  deletesequencete,
};
