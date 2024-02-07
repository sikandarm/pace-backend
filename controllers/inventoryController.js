const { Inventory, sequelize } = require("../models");
const { errorResponse, successResponse } = require("../utils/apiResponse");

exports.createInventory = async (req, res) => {
  // const transaction = await sequelize.transaction();
  try {
    let {
      ediStdNomenclature,
      aiscManualLabel,
      shape,
      weight,
      depth,
      grade,
      poNumber,
      heatNumber,
      orderArrivedInFull,
      orderArrivedCMTR,
      itemType,
      lengthReceivedFoot,
      lengthReceivedInch,
      quantity,
      poPulledFromNumber,
      lengthUsedFoot,
      lengthUsedInch,
      lengthRemainingFoot,
      lengthRemainingInch,
    } = req.body;

    const duplicate = await Inventory.findOne({
      where: { ediStdNomenclature },
    });

    if (duplicate) {
      return errorResponse(res, 409, "Inventory item already exists.");
    }

    const inventory = await Inventory.create({
      ediStdNomenclature,
      aiscManualLabel,
      shape,
      weight,
      depth,
      grade,
      poNumber,
      heatNumber,
      orderArrivedInFull,
      orderArrivedCMTR,
      itemType,
      lengthReceivedFoot,
      lengthReceivedInch,
      quantity,
      poPulledFromNumber,
      lengthUsedFoot,
      lengthUsedInch,
      lengthRemainingFoot,
      lengthRemainingInch,
    });
    // , {transaction}

    // await transaction.commit();

    return successResponse(
      res,
      201,
      { inventory },
      "Inventory created successfully!"
    );
  } catch (err) {
    // await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.updateInventory = async (req, res) => {
  // const transaction = await sequelize.transaction();
  try {
    const id = req.params.id;

    let {
      ediStdNomenclature,
      aiscManualLabel,
      shape,
      weight,
      depth,
      grade,
      poNumber,
      heatNumber,
      orderArrivedInFull,
      orderArrivedCMTR,
      itemType,
      lengthReceivedFoot,
      lengthReceivedInch,
      quantity,
      poPulledFromNumber,
      lengthUsedFoot,
      lengthUsedInch,
      lengthRemainingFoot,
      lengthRemainingInch,
    } = req.body;

    const inventory = await Inventory.findByPk(id);

    if (!inventory) {
      return errorResponse(res, 409, "Inventory not found.");
    }

    const updatedInventory = await inventory.update({
      ediStdNomenclature,
      aiscManualLabel,
      shape,
      weight,
      depth,
      grade,
      poNumber,
      heatNumber,
      orderArrivedInFull,
      orderArrivedCMTR,
      itemType,
      lengthReceivedFoot,
      lengthReceivedInch,
      quantity,
      poPulledFromNumber,
      lengthUsedFoot,
      lengthUsedInch,
      lengthRemainingFoot,
      lengthRemainingInch,
    });

    // , {transaction}

    if (updatedInventory) {
      // await transaction.commit();
      return successResponse(
        res,
        201,
        { inventory: updatedInventory },
        "Inventory updated successfully!"
      );
    }

    // await transaction.rollback();
    return errorResponse(res, 400, "Update Failed!");
  } catch (err) {
    // await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.getInventoryItems = async (req, res) => {
  try {
    const inventories = await Inventory.findAll();
    if (!inventories?.length) {
      return successResponse(res, 200, {}, "No items found");
    }
    return successResponse(res, 200, { inventories });
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong", err);
  }
};

exports.getInventoryItem = async (req, res) => {
  try {
    const id = req.params.id;

    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      return successResponse(res, 200, {}, "No inventory found");
    }

    return successResponse(res, 200, { inventory });
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.deleteInventoryItem = async (req, res) => {
  try {
    const id = req.params.id;

    const inventory = await Inventory.findByPk(id);

    if (!inventory) {
      return successResponse(res, 200, {}, "No inventory found");
    }

    const isDeleted = await inventory.destroy({ force: true });
    if (isDeleted) {
      return successResponse(res, 200, {}, "Deleted successfully");
    }
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.exportInventory = async (req, res) => {
  try {
    const inventories = await Inventory.findAll();
    return successResponse(res, 200, inventories);
  } catch (err) {
    console.log(err);
    return errorResponse(res, 400, "Something went wrong", err);
  }
};
