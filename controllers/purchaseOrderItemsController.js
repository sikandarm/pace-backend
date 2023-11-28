const { errorResponse, successResponse } = require("../utils/apiResponse");
const {
  Purchase_Order_Items,
  PurchaseOrder,
  Inventory,
  sequelize,
} = require("../models");
//CreatePurchaseOrderItem

const createPurchaseOrderItem = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { po_id, quantity, inventory_id } = req.body;

    const purchaseOrder = await PurchaseOrder.findOne({
      where: {
        id: po_id,
      },
    });

    if (!purchaseOrder) {
      await transaction.rollback();
      return errorResponse(res, 404, "PurchaseOrder not found");
    }

    // Check if the inventory_id exists in the Inventory table
    const inventory = await Inventory.findOne({
      where: {
        id: inventory_id,
      },
    });

    if (!inventory) {
      await transaction.rollback();
      return errorResponse(res, 404, "Inventory item not found");
    }

    const purchaseorderitem = await Purchase_Order_Items.create(
      {
        quantity,
        po_id,
        inventory_id,
        created_by: req.user.id,
      },
      {
        transaction,
        include: [PurchaseOrder, Inventory],
      }
    );

    await transaction.commit();
    return successResponse(
      res,
      201,
      { purchaseorderitem },
      "PurchaseOrder created successfully"
    );
  } catch (error) {
    await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong", error);
  }
};
//GetAllPurchaseOrderItem

const getAllPurchaseOrderItems = async (req, res) => {
  try {
    const purchaseOrderItems = await Purchase_Order_Items.findAll( );

    return successResponse(
      res,
      200,
      { purchaseOrderItems },
      "PurchaseOrderItems retrieved successfully"
    );
  } catch (error) {
    return errorResponse(res, 500, "Something went wrong", error);
  }
};

module.exports = {
  createPurchaseOrderItem,
  getAllPurchaseOrderItems,
};
