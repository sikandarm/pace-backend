// Create a new PurchaseOrder

const { errorResponse, successResponse } = require("../utils/apiResponse");
const { PurchaseOrder, Company, Vendor, sequelize } = require("../models");

const createPurchaseOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      company_id,
      delivery_date,
      confirm_with,
      vendor_id,
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

    // Look up company and vendor IDs based on names
    // const company = await Company.findOne({ where: { name: company_name } });
    // const vendor = await Vendor.findOne({ where: { vendor_name } });
    // console.log(req.body, "-----------");
    // if (!company || !vendor) {
    //   throw new Error("Company or Vendor not found");
    // }

    const purchaseOrder = await PurchaseOrder.create(
      {
        company_name: company_id,
        delivery_date,
        confirm_with,
        vendor_name: vendor_id,
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
    return errorResponse(res, 400, "Something went wrong", error.message);
  }
};

// update PurchaseOrder

const updatePurchaseOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const purchaseOrderId = req.params.id;
    const {
      company_id,
      delivery_date,
      confirm_with,
      vendor_id,
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

    purchaseOrder.company_name = company_id;
    purchaseOrder.delivery_date = delivery_date;
    purchaseOrder.confirm_with = confirm_with;
    purchaseOrder.vendor_name = vendor_id;
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
    const name = req.query.vendor_name;
    if(name)
    {
      const vendor = await Vendor.findOne({where:{vendor_name : name}})

    }
    // console.log(vendor)
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    let whereClause = {};

    // Define a condition for the search
    // const searchCondition = {
    //   deleted_at: null,
    // };
    if (name) {
      whereClause = { vendor_name: vendor.id , deleted_at : null };
    } else {
      whereClause = { deleted_at: null };
    }

    const totalCount = await PurchaseOrder.count({
      where: whereClause,
    });
    const totalPages = Math.ceil(totalCount / pageSize);
    const offset = (page - 1) * pageSize;
    const purchaseOrders = await PurchaseOrder.findAll({
      where: whereClause,
      offset: offset,
      include: [
        {
          model: Company,
          attributes: ["name"],
          as: "company",
        },
        {
          model: Vendor,
          attributes: ["vendor_name"],
          as: "vendor",
        },
      ],
    });

    // console.log(purchaseOrders, "==============");
    if (!purchaseOrders || purchaseOrders.length === 0) {
      return successResponse(res, 200, { purchaseOrders: [], totalPages });
    }
    // const modifiedPurchaseOrder = purchaseOrders.map((purchaseOrder) => {
    //   return {
    //     id: purchaseOrder.id,
    //     vendor_name: purchaseOrder.vendor_name,
    //     company_name: purchaseOrder.company_name,
    //     delivery_date: purchaseOrder.delivery_date,
    //     confirm_with: purchaseOrder.confirm_with,
    //     order_date: purchaseOrder.order_date,
    //     placed_via: purchaseOrder.placed_via,
    //     po_number: purchaseOrder.po_number,
    //     order_by: purchaseOrder.order_by,
    //     order_by: purchaseOrder.order_by,
    //     ship_via: purchaseOrder.ship_via,
    //     phone: purchaseOrder.phone,
    //     email: purchaseOrder.email,
    //     term: purchaseOrder.term,
    //     fax: purchaseOrder.fax,
    //   };

    // });
    return successResponse(
      res,
      200,
      {
        purchaseOrders: purchaseOrders,
        page: (totalPages, req.query.page),
      },
      "Purchase orders retrieved successfully"
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
      const purchaseOrdeById = await PurchaseOrder.findByPk(id, { include: [
        {
          model: Company,
          attributes: ["name"],
          as: "company",
        },
        {
          model: Vendor,
          attributes: ["vendor_name"],
          as: "vendor",
        },
      ]});

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
