const { errorResponse, successResponse } = require("../utils/apiResponse");
const {
  Job,
  fabricated_items_perjob,
  PurchaseOrder,
  Purchase_Order_Items,
  Inventory,
  Company,
  Vendor,
  User,
  sequelize,
} = require("../models");

const getfebricateditems = async (req, res) => {
  try {
    const { id } = req.params;
    const getitmes = await fabricated_items_perjob.findAll({
      where: {
        job_Id: id,
        deletedAt: null,
      },
      attributes: ["id", "name", "quantity"],
      include: [
        {
          model: Job,
          attributes: ["name", "po_id"],
          include: [
            {
              model: PurchaseOrder,
              attributes: ["id", "po_number", "status"],
            },
          ],
        },
        {
          model: Purchase_Order_Items,
          attributes: ["inventory_id"],
          include: {
            model: Inventory,
            attributes: ["ediStdNomenclature"],
          },
        },
      ],
    });

    // const poInventory = await Purchase_Order_Items.findAll({
    //   where: {
    //     po_id: getitmes[0]?.Job?.PurchaseOrder?.id,
    //   },
    //   attributes: ["po_id", "quantity"],
    //   include: {
    //     model: Inventory,
    //     attributes: ["ediStdNomenclature", "aiscManualLabel"],
    //   },
    // });

    if (getitmes.length > 0) {
      return successResponse(
        res,
        200,
        { FabricatedItems: getitmes },
        "Fabricated Itmes PerJob"
      );
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
    const { name, job_Id, quantity, poitems_id } = req.body;
    const existingItem = await fabricated_items_perjob.findOne({
      where: {
        name: name,
      },
    });

    if (existingItem) {
      return successResponse(res, 409, "Fabricated Items Already Exist!");
    }

    const createitem = await fabricated_items_perjob.create(
      {
        name: name,
        quantity: quantity,
        job_Id: job_Id,
        poitems_id: poitems_id,
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

const updatefabricateditems = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const items = req.params.id;
    const { name, quantity, job_Id, poitems_id } = req.body;
    const fabricateditems = await fabricated_items_perjob.findByPk(items);
    if (!fabricateditems) {
      return successResponse(res, 200, "No Fabricated Item found");
    }
    const updateitem = await fabricateditems.update(
      {
        name: name,
        quantity: quantity,
        job_Id: job_Id,
        poitems_id: poitems_id,
      },
      { transaction }
    );
    await transaction.commit();
    if (updateitem) {
      return successResponse(res, 200, updateitem, "Fabricated Item Update");
    } else {
      return successResponse(res, 200, "Fabricated Item Not Update");
    }
  } catch (err) {
    return errorResponse(res, 500, "Error while deleting", err);
  }
};

const deletefabricateditems = async (req, res) => {
  try {
    const items = req.params.id;
    const fabricateditems = await fabricated_items_perjob.findByPk(items);
    if (!fabricateditems) {
      return successResponse(res, 200, "No Fabricated Item found");
    }

    if (fabricateditems.deletedAt === null) {
      fabricateditems.deletedBy = req.user.id;
      fabricateditems.deletedAt = new Date();
      await fabricateditems.save();

      return successResponse(
        res,
        200,
        { fabricateditems },
        "Items Deleted successfully"
      );
    } else {
      return successResponse(
        res,
        200,
        { purchaseOrder },
        "Itmes is already deleted"
      );
    }
  } catch (err) {
    return errorResponse(res, 500, "Error while deleting", err);
  }
};

const getallfebricateditems = async (req, res) => {
  try {
    const allitems = await fabricated_items_perjob.findAll({
      include: [
        {
          model: Job,
          attributes: ["name", "po_id"],
          include: [
            {
              model: PurchaseOrder,
              include: {
                model: Purchase_Order_Items,
              },
            },
          ],
        },
      ],
    });

    if (allitems) {
      return successResponse(res, 200, allitems, "All Fabericated Items List");
    } else {
      return successResponse(res, 200, "Not Found Fabericated Items");
    }
  } catch (error) {
    return errorResponse(res, 500, "Error while deleting", error);
  }
};

const getpoItems = async (req, res) => {
  try {
    const { id } = req.params;
    const jobdetail = await Job.findAll({
      where: {
        id: id,
        deletedAt: null,
      },
    });
    const poitem = await Purchase_Order_Items.findAll({
      where: {
        po_id: jobdetail[0]?.po_id,
        deleted_At: null,
      },
      include: {
        model: Inventory,
        attributes: ["ediStdNomenclature", "quantity"],
      },
    });

    const modifieditem = poitem.map((item) => ({
      id: item.id,
      po_id: item.po_id,
      quantity: item.quantity,
      itemName: item.Inventory.ediStdNomenclature,
    }));
    if (modifieditem.length > 0) {
      return successResponse(res, 200, modifieditem, "Items");
    } else {
      return successResponse(res, 200, modifieditem, "NotFound");
    }
  } catch (error) {
    return errorResponse(res, 500, "Error while deleting", error);
  }
};

const getfabricateditemsbyname = async (req, res) => {
  try {
    const { name } = req.params;
    const dataitems = await fabricated_items_perjob.findAll({
      where: {
        name: name,
      },
      include: {
        model: Purchase_Order_Items,
        attributes: ["inventory_id"],
        include: {
          model: Inventory,
          attributes: ["ediStdNomenclature"],
        },
      },
    });
    const datamodified = dataitems.map((items) => ({
      id: items.id,
      name: items.name,
      quantity: items.quantity,
      poitems_id: items.poitems_id,
      POItemName: items.Purchase_Order_Item.Inventory.ediStdNomenclature,
    }));
    if (datamodified) {
      return successResponse(res, 200, datamodified, "Items Found");
    }
  } catch (error) {
    return errorResponse(res, 500, "Error while Fetching", error);
  }
};

module.exports = {
  getfebricateditems,
  createfabricateditems,
  deletefabricateditems,
  updatefabricateditems,
  getallfebricateditems,
  getpoItems,
  getfabricateditemsbyname,
};
