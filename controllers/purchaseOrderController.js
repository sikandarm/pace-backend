// const fs = require("fs");
// const path = require("path");
const { errorResponse, successResponse } = require("../utils/apiResponse");
const { toSentenceCase } = require("../utils/stringtosentencecase");
const sendPushNotification = require("../utils/sendPushNotification");
const pushNotificationQueue = require("../services/pushNotificationService");
const {
  PurchaseOrder,
  Purchase_Order_Items,
  Company,
  Vendor,
  User,
  Inventory,
  Job,
  sequelize,
  DeviceToken,
  Notification,
  Role,
} = require("../models");

const createPurchaseOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      company_id,
      delivery_date,
      confirm_with,
      vendor_id,
      userId,
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
      status,
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
        userId: userId,
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
        status,
        created_by: req.user.id,
      },
      { transaction }
    );

    if (purchaseOrder) {
      // const targetRolesFilePath = path.join(
      //   __dirname,
      //   "../config/targetRoles.json"
      // );
      // let targetRoles = [];
      // try {
      //   if (fs.existsSync(targetRolesFilePath)) {
      //     const targetRolesData = fs.readFileSync(targetRolesFilePath, "utf8");
      //     targetRoles = JSON.parse(targetRolesData);
      //   }
      // } catch (err) {
      //   console.error("Error while reading targetRoles file:", err);
      // }
      const usersWithTargetRoles = await User.findAll({
        include: {
          model: Role,
          attributes: ["name"],
          as: "roles",
          where: {
            name: "Receiver",
          },
        },
      });
      // Use a Set to collect unique user IDs
      const targetUserIdsSet = new Set();
      usersWithTargetRoles.forEach((user) => {
        targetUserIdsSet.add(user.id);
      });

      const targetUserIds = Array.from(targetUserIdsSet);

      const managerTokens = await DeviceToken.findAll({
        where: { userId: targetUserIds },
      });

      // Filter out empty or invalid tokens from the array
      const validManagerTokens = managerTokens
        .map((token) => token.token)
        .filter((token) => typeof token === "string" && token.trim() !== "");

      if (validManagerTokens.length > 0) {
        const registrationTokens = validManagerTokens;
        const payload = {
          notification: {
            title: "Purchase Order",
            body: `Admin Created New Purchase Order`,
          },
        };

        // await pushNotificationQueue.add({ registrationTokens, payload });
        await sendPushNotification(registrationTokens, payload);

        const notifications = targetUserIds.map((userId) => ({
          title: payload.notification.title,
          body: payload.notification.body,
          userId,
        }));
        await Notification.bulkCreate(notifications);
      }
    }
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
      status,
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
    purchaseOrder.status = status;
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
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    let whereClause = {};
    if (name) {
      const vendor = await Vendor.findOne({ where: { vendor_name: name } });
      whereClause = { vendor_name: vendor.id, deleted_at: null };
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
        {
          model: User,
          attributes: ["firstName"],
          as: "firstName",
        },
      ],
    });
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
    //console.log(id)
    if (id) {
      const purchaseOrdeById = await PurchaseOrder.findByPk(id, {
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
          {
            model: User,
            attributes: ["firstName"],
            as: "firstName",
          },
        ],
      });

      const items = await Purchase_Order_Items.findAll({
        where: {
          po_id: id,
        },
        include: [
          {
            model: Inventory,
            attributes: ["ediStdNomenclature"],
          },
        ],
      });

      if (purchaseOrdeById) {
        return successResponse(res, 200, {
          purchaseOrder: purchaseOrdeById,
          PurchaseOrderItems: items,
        });
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

const getPurchaseOrderByLoginUser = async (req, res) => {
  const user = req.user;
  const whereClause = {
    deleted_at: null,
  };

  if (user.roles[0] === "Receiver" || user.roles[0] === "Admin") {
    try {
      const purchaseOrders = await PurchaseOrder.findAll({
        where: whereClause,
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
          {
            model: User,
            attributes: ["firstName"],
            as: "firstName",
          },
        ],
      });
      if (purchaseOrders) {
        return successResponse(
          res,
          200,
          { purchaseOrders },
          "All PurchaseOrder"
        );
      } else {
        return errorResponse(res, 404, "Not Found");
      }
    } catch (error) {
      return errorResponse(error, 500, "Error fetching data");
    }
  } else {
    try {
      if (user.id) {
        const purchaseOrders = await PurchaseOrder.findAll({
          where: {
            userId: user.id,
            ...whereClause,
          },
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
            {
              model: User,
              attributes: ["firstName"],
              as: "firstName",
            },
          ],
        });

        if (purchaseOrders) {
          return successResponse(
            res,
            200,
            { purchaseOrders },
            "PurchaseOrder Data"
          );
        } else {
          return errorResponse(res, 404, "Not Found");
        }
      }
    } catch (error) {
      return errorResponse(error, 500, "Error fetching data");
    }
  }
};

const changeStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { status } = req.body;
    const modifiedstatus = toSentenceCase(status);
    const purchaseOrder = await PurchaseOrder.findByPk(id);
    if (purchaseOrder.status === status) {
      return successResponse(res, 200, "Status Already Set");
    }

    if (!purchaseOrder) {
      return errorResponse(res, 404, "PurchaseOrder not found");
    }

    if (modifiedstatus === "Received") {
      purchaseOrder.status = modifiedstatus;
      await purchaseOrder.save({ transaction });
      await transaction.commit();

      let createjob;
      if (purchaseOrder) {
        createjob = await Job.create({
          name: purchaseOrder.po_number,
          po_id: id,
        });
      }

      if (createjob) {
        return successResponse(
          res,
          200,
          { purchaseOrder, createjob },
          "Status updated successfully And Job Created"
        );
      }
    } else {
      return errorResponse(res, 404, "Not Update Status");
    }
  } catch (err) {
    console.error(err);
    await transaction.rollback();
    return errorResponse(res, 500, "Something went wrong", err);
  }
};

const getItemsByLoginUser = async (req, res) => {
  try {
    const { id } = req.params;
    //console.log(id)
    if (id) {
      const purchaseOrdeById = await PurchaseOrder.findByPk(id, {
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
          {
            model: User,
            attributes: ["firstName"],
            as: "firstName",
          },
        ],
      });

      const items = await Purchase_Order_Items.findAll({
        where: {
          po_id: id,
        },
        include: [
          {
            model: Inventory,
            attributes: ["ediStdNomenclature"],
          },
        ],
      });
      const Itemsdata = items.map((item) => ({
        id: item.id,
        po_id: item.po_id,
        InventoryItem: item.Inventory.ediStdNomenclature,
        quantity: item.quantity,
      }));
      const Po = {
        id: purchaseOrdeById.id,
        companyName: purchaseOrdeById.company.name,
        vendorName: purchaseOrdeById.vendor.vendor_name,
        PoNumber: purchaseOrdeById.po_number,
        createdAt: purchaseOrdeById.createdAt,
        OrderBy: purchaseOrdeById.order_by,
        shipTo: purchaseOrdeById.ship_to,
        shipVia: purchaseOrdeById.ship_via,
        orderDate: purchaseOrdeById.order_date,
        deliveryDate: purchaseOrdeById.delivery_date,
        placedVia: purchaseOrdeById.placed_via,
      };

      if (purchaseOrdeById) {
        return successResponse(res, 200, {
          purchaseOrder: Po,
          PurchaseOrderItems: Itemsdata,
        });
      } else {
        return errorResponse(res, 400, "Not Found!");
      }
    }
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

module.exports = {
  createPurchaseOrder,
  updatePurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  deletePurchaseOrder,
  getPurchaseOrderByLoginUser,
  changeStatus,
  getItemsByLoginUser,
};
