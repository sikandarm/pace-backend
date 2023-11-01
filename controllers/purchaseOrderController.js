const path = require("path");
const fs = require("fs");

// Create a new PurchaseOrder

const { errorResponse, successResponse } = require("../utils/apiResponse");
const { PurchaseOrder, sequelize } = require("../models");
const createPurchaseOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      company_name,
      delivery_date,
      confirm_with,
      vendor_name,
      order_date,
      placed_via,
      po_number,
      ship_via,
      order_by,
      ship_to,
      address, 
      phone,
      email,
      term,
      fax,
    } = req.body;
    const purchaseOrder = await PurchaseOrder.create(
      {
        company_name,
        delivery_date,
        confirm_with,
        vendor_name,
        order_date,
        placed_via,
        po_number,
        ship_via,
        order_by,
        ship_to,
        address,
        phone,
        email,
        term,
        fax,
        created_by: req.user.id,
      },
      { transaction }
    );
    await transaction.commit();
    return successResponse(
      res,
      201,
      { purchaseOrder },
      "purchaseOrder created successfully"
    );
  } catch (error) {
    await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong", error);
  }
};

// update PurchaseOrder

const updatePurchaseOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const purchaseOrderId = req.params.id;
    const {
      company_name,
      delivery_date,
      confirm_with,
      vendor_name,
      order_date,
      placed_via,
      po_number,
      ship_via,
      order_by,
      ship_to,
      address,
      phone,
      email,
      term,
      fax,
    } = req.body;

    const purchaseOrder = await PurchaseOrder.findByPk(purchaseOrderId);

    if (!purchaseOrder) {
      return errorResponse(res, 404, "PurchaseOrder not found");
    }

    purchaseOrder.company_name = company_name;
    purchaseOrder.delivery_date = delivery_date;
    purchaseOrder.confirm_with = confirm_with;
    purchaseOrder.vendor_name = vendor_name;
    purchaseOrder.order_date = order_date;
    purchaseOrder.placed_via = placed_via;
    purchaseOrder.po_number = po_number;
    purchaseOrder.order_by = order_by;
    purchaseOrder.ship_via = ship_via;
    purchaseOrder.address = address;
    purchaseOrder.ship_to = ship_to;
    purchaseOrder.phone = phone;
    purchaseOrder.email = email;
    purchaseOrder.term = term;
    purchaseOrder.fax = fax;
    purchaseOrder.updated_by = req.user.id;

    await purchaseOrder.save({ transaction });
    await transaction.commit();
    return successResponse(
      res,
      200,
      { purchaseOrder },
      "purchaseOrder updated successfully"
    );
  } catch (err) {
    console.error(err);
    await transaction.rollback();
    return errorResponse(res, 500, "Something went wrong", err);
  }
};

//GetAll PurchaseOrder

const getAllPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.findAll();

    return successResponse(
      res,
      200,
      { purchaseOrders },
      "All purchase orders retrieved successfully"
    );
  } catch (error) {
    return errorResponse(res, 500, "Something went wrong", error);
  }
};

//Get purchaseorder by Id

const getPurchaseOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const purchaseOrdeById = await PurchaseOrder.findByPk(id);
      if (purchaseOrdeById) {
        return successResponse(res, 200, { purchaseOrder: purchaseOrdeById });
      }
    }
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

// Delete Purchasorder

const deletePurchaseOrder = async (req, res) => {
  try {
    const purchaseOrdeById = req.params.id;
    const purchaseOrder = await PurchaseOrder.findByPk(purchaseOrdeById);
    if (!purchaseOrder) {
      return successResponse(
        res,
        200,
        { purchaseOrder: {} },
        "No PurchaseOrder found"
      );
    }
    // Check if the purchase order has already been deleted
    if (purchaseOrder.deleted_at === null) {
      purchaseOrder.deleted_by = req.user.id;
      purchaseOrder.deleted_at = new Date();
      await purchaseOrder.save();

      return successResponse(
        res,
        200,
        { purchaseOrder },
        "PurchaseOrder soft deleted successfully"
      );
    } else {
      return successResponse(
        res,
        200,
        { purchaseOrder },
        "PurchaseOrder is already deleted"
      );
    }
  } catch (err) {
    return errorResponse(res, 500, "Error while deleting PurchaseOrder", err);
  }
};


module.exports = {
  createPurchaseOrder,
  updatePurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  deletePurchaseOrder,
};
