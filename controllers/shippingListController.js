const { errorResponse, successResponse } = require("../utils/apiResponse");
const { Op } = require("sequelize");
const {
  bill_of_landing_items,
  fabricated_items_perjob,
  PurchaseOrder,
  sequelize,
  Vendor,
  Company,
  User,
  DeviceToken,
  Notification,
  Role,
  bill_of_lading,
} = require("../models");
const sendPushNotification = require("../utils/sendPushNotification");
const { promises } = require("nodemailer/lib/xoauth2");

// const createBillItems = async (req, res) => {
//   const transaction = await sequelize.transaction();
//   try {
//     const { fabricatedid, poid, quantity, companyid } = req.body;
//     if (fabricatedid === null || poid === null || companyid === null) {
//       return successResponse(
//         res,
//         200,
//         null,
//         "Fabricated Item and Purchase Order and Company are required"
//       );
//     }
//     const existingBill = await bill_of_landing.findOne({
//       where: {
//         fabricated_items: fabricatedid,
//         purchase_order: poid,
//         deletedAt: null,
//       },
//     });
//     if (existingBill) {
//       // await transaction.rollback();
//       return errorResponse(
//         res,
//         200,
//         existingBill,
//         "Bill of Lading Items Already Exists"
//       );
//     }
//     const billCreate = await bill_of_landing.create(
//       {
//         fabricated_items: fabricatedid,
//         purchase_order: poid,
//         quantity: quantity,
//         company_id: companyid,
//       },
//       { transaction }
//     );
//     // if (billCreate) {
//     //   const targetRoles = ["Shipper", "Job Site Foreman"];
//     //   const usersWithTargetRoles = await User.findAll({
//     //     include: {
//     //       model: Role,
//     //       attributes: ["name"],
//     //       as: "roles",
//     //       where: {
//     //         name: targetRoles, // Use an array to match multiple roles
//     //       },
//     //     },
//     //   });
//     //   // Use a Set to collect unique user IDs
//     //   const targetUserIdsSet = new Set();
//     //   usersWithTargetRoles.forEach((user) => {
//     //     targetUserIdsSet.add(user.id);
//     //   });
//     //   const targetUserIds = Array.from(targetUserIdsSet);
//     //   const managerTokens = await DeviceToken.findAll({
//     //     where: { userId: targetUserIds },
//     //   });
//     //   // Filter out empty or invalid tokens from the array
//     //   const validManagerTokens = managerTokens
//     //     .map((token) => token.token)
//     //     .filter((token) => typeof token === "string" && token.trim() !== "");
//     //   if (validManagerTokens.length > 0) {
//     //     const registrationTokens = validManagerTokens;
//     //     const payload = {
//     //       notification: {
//     //         title: "Bill Of Lading",
//     //         body: `Admin Created Bill Of Lading`,
//     //       },
//     //     };
//     //     // await pushNotificationQueue.add({ registrationTokens, payload });
//     //     await sendPushNotification(registrationTokens, payload);
//     //     const notifications = targetUserIds.map((userId) => ({
//     //       title: payload.notification.title,
//     //       body: payload.notification.body,
//     //       userId,
//     //     }));
//     //     await Notification.bulkCreate(notifications);
//     //   }
//     // }
//     await transaction.commit();
//     if (billCreate) {
//       const fabricatedItem = await fabricated_items_perjob.findByPk(
//         fabricatedid
//       );
//       const purchaseOrder = await PurchaseOrder.findByPk(poid, {
//         include: [
//           {
//             model: Vendor,
//             as: "vendor",
//             attributes: ["vendor_name"],
//           },
//           {
//             model: Company,
//             as: "company",
//             attributes: ["name"],
//           },
//         ],
//       });
//       const response = {
//         id: billCreate.id,
//         fabricatedItemName: fabricatedItem ? fabricatedItem.name : null,
//         quantity: billCreate.quantity,
//         companyName:
//           purchaseOrder && purchaseOrder.company
//             ? purchaseOrder.company.name
//             : null,
//         vendorName:
//           purchaseOrder && purchaseOrder.vendor
//             ? purchaseOrder.vendor.vendor_name
//             : null,
//       };
//       return successResponse(
//         res,
//         200,
//         response,
//         "Bill of Lading Items Created!"
//       );
//     }
//   } catch (error) {
//     await transaction.rollback();
//     return errorResponse(res, 400, "Something went wrong!", error);
//   }
// };

const getBill = async (req, res) => {
  try {
    const data = await bill_of_lading.findAll({
      include: [
        {
          model: bill_of_landing_items,
          attributes: ["quantity"],
          include: [
            {
              model: PurchaseOrder,
              attributes: ["po_number", "fax", "phone"],
              include: {
                model: Vendor,
                as: "vendor",
                attributes: ["vendor_name"],
              },
            },
            {
              model: fabricated_items_perjob,
              attributes: ["name"],
            },
          ],
        },
        {
          model: Company,
          attributes: ["name", "address"],
        },
      ],
      attributes: [
        "id",
        "billTitle",
        "address",
        "dilveryDate",
        "orderDate",
        "terms",
        "company_id",
        "shipVia",
        "createdAt",
        "updatedAt",
      ],
    });

    if (data) {
      // Group by billTitle
      const groupedData = {};
      data.forEach((item) => {
        const { id, billTitle, ...rest } = item.get();
        const poNumber = item.bill_of_landing_item.PurchaseOrder.po_number;
        if (!groupedData[billTitle]) {
          groupedData[billTitle] = {
            id,
            billTitle,
            poNumber, // Include poNumber in the groupedData
            items: [],
            address: rest.address,
            dilveryDate: rest.dilveryDate,
            orderDate: rest.orderDate,
            terms: rest.terms,
            shipVia: rest.shipVia,
            CompanyName: rest.Company.name,
            CompanyAddress: rest.Company.address,
          };
        }
        groupedData[billTitle].items.push({
          Quantity: item.bill_of_landing_item.quantity,
          FabricatedItems:
            item.bill_of_landing_item.fabricated_items_perjob.name,

          Fax: item.bill_of_landing_item.PurchaseOrder.fax,
          Phone: item.bill_of_landing_item.PurchaseOrder.phone,
          // Add other fields as needed
        });
      });

      // Modify the result to include only specific fields
      const modifiedData = Object.values(groupedData).map((group) => ({
        id: group.id,
        billTitle: group.billTitle,
        poNumber: group.poNumber,
        address: group.address,
        dilveryDate: group.dilveryDate,
        orderDate: group.orderDate,
        terms: group.terms,
        shipVia: group.shipVia,
        CompanyName: group.CompanyName,
        CompanyAddress: group.CompanyAddress,
        BillofLadingItems: group.items,
      }));

      return successResponse(
        res,
        200,
        { Billdata: modifiedData },
        "Bill Found successfully!"
      );
    } else {
      return successResponse(res, 404, {}, "Bill Not Found!");
    }
  } catch (error) {
    return errorResponse(res, 400, "Something went wrong!", error);
  }
};

const deleteBill = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { billTitle } = req.params;

    // Find all bills with the specified title
    const billsToDelete = await bill_of_lading.findAll({
      where: {
        billTitle: billTitle,
        deletedAt: null, // Include only bills that are not already deleted
      },
      include: {
        model: bill_of_landing_items,
        attributes: ["quantity", "deletedAt", "deletedBy"],
      },
    });

    if (!billsToDelete || billsToDelete.length === 0) {
      return successResponse(res, 200, {}, "No Bills found");
    }

    // Soft delete associated bill_of_lading and bill_of_landing_items
    await Promise.all(
      billsToDelete.map(async (bill) => {
        // Soft delete the bill_of_lading
        const deletedByUserId = req.user.id;
        bill.deletedBy = deletedByUserId;
        bill.deletedAt = new Date();
        await bill.save({ transaction });

        // Soft delete associated bill_of_lading_items
        await Promise.all(
          bill.bill_of_landing_items.map(async (item) => {
            item.deletedBy = deletedByUserId;
            item.deletedAt = new Date();
            await item.save({ transaction });
          })
        );
      })
    );

    await transaction.commit();

    return successResponse(
      res,
      200,
      {},
      `Bills with title "${title}" deleted successfully`
    );
  } catch (err) {
    await transaction.rollback(); // Rollback the transaction in case of error
    return errorResponse(res, 500, "Error while Deleting Bills", err);
  }
};

const createBill = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      billTitle,
      address,
      dilveryDate,
      orderDate,
      terms,
      shipVia,
      company_id,
      bill_of_landing_item, // Array of bill of lading items
    } = req.body;

    const existingBillItems = await bill_of_landing_items.findAll({
      where: {
        [Op.or]: bill_of_landing_item.map((item) => ({
          fabricated_items: item.fabricatedItemId,
          purchase_order: item.purchaseOrderId,
        })),
      },
    });

    if (existingBillItems.length > 0) {
      // await transaction.rollback();
      return errorResponse(
        res,
        400,
        "One or more bill of lading items already exist!",
        null
      );
    }

    let bill;
    await Promise.all(
      bill_of_landing_item.map(async (item) => {
        const billItem = await bill_of_landing_items.create({
          fabricated_items: item.fabricatedItemId,
          purchase_order: item.purchaseOrderId,
          quantity: item.quantity,
        });
        // console.log(billItem.id);
        bill = await bill_of_lading.create({
          billTitle: billTitle,
          address: address,
          dilveryDate: dilveryDate,
          orderDate: orderDate,
          terms: terms,
          shipVia: shipVia,
          company_id: company_id,
          bill_lading_items: billItem.id,
        });
      })
    );
    if (bill) {
      const targetRoles = ["Shipper", "Job Site Foreman"];
      const usersWithTargetRoles = await User.findAll({
        include: {
          model: Role,
          attributes: ["name"],
          as: "roles",
          where: {
            name: targetRoles, // Use an array to match multiple roles
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
            title: "Bill Of Lading",
            body: `Admin Created Bill Of Lading`,
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

      return successResponse(res, 200, bill, "Bill of Lading Created!");
    }
  } catch (error) {
    return errorResponse(res, 400, "Error creating bill!", error);
  }
};

module.exports = {
  // createBillItems,
  getBill,
  deleteBill,
  createBill,
};
