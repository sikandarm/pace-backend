const { errorResponse, successResponse } = require("../utils/apiResponse");
const { Job, fabricated_items_perjob, sequelize } = require("../models");

const getfebricateditems = async (req, res) => {
  try {
    const { id } = req.params;
    const getitmes = await fabricated_items_perjob.findAll({
      where: {
        job_Id: id,
      },
      include: [
        {
          model: Job,
          attributes: ["name", "po_id"],
        },
      ],
    });

    if (getitmes.length > 0) {
      return successResponse(res, 200, getitmes, "Fabricated Itmes PerJob");
    } else {
      return successResponse(res, 200, getitmes, "Fabricated Itmes Not Found");
    }
  } catch (error) {
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};

const createfabricateditems = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, job_Id, quantity } = req.body;
    const duplicate = await fabricated_items_perjob.findAll({
      where: {
        name: name,
        job_Id: job_Id,
      },
    });

    if (duplicate.length > 0) {
      return successResponse(res, 409, "Fabricated Items Already Exist!");
    }

    const createitem = await fabricated_items_perjob.create(
      {
        name: name,
        quantity: quantity,
        job_Id: job_Id,
      },
      { transaction }
    );

    await transaction.commit();
    if (createitem) {
      return successResponse(res, 200, createitem, "Fabricated Item Created");
    } else {
      return successResponse(res, 200, "Fabricated Item Not Created!");
    }
  } catch (error) {
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};

module.exports = {
  getfebricateditems,
  createfabricateditems,
};
