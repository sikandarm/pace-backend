"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const receiverRole = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = 'Admin'",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (receiverRole && receiverRole.length > 0) {
      const roleArray = [
        "add_company",
        "add_contact",
        "add_fabricated_items",
        "add_inventory",
        "add_job",
        "add_permision",
        "add_purchase",
        "add_purchase_item",
        "add_role",
        "add_sequence",
        "add_task",
        "add_user",
        "collaborate_on_microsoft_whiteboard",
        "delete_company",
        "delete_contact",
        "delete_inventory",
        "delete_job",
        "delete_permision",
        "delete_purchase",
        "delete_role",
        "delete_sequence",
        "delete_task",
        "delete_user",
        "detail_job",
        "download_diagram",
        "edit_company",
        "edit_contact",
        "edit_inventory",
        "edit_job",
        "edit_permision",
        "edit_profile",
        "edit_purchase",
        "edit_role",
        "edit_sequence",
        "edit_task",
        "edit_user",
        "export_inventory",
        "export_job",
        "export_permision",
        "export_role",
        "export_task",
        "export_tasks_in_pdf",
        "export_user",
        "make_call",
        "update_fabricated_items",
        "view_contact",
        "view_dashboard_with_graphs",
        "view_inventory",
        "view_inventory_detail",
        "view_job",
        "view_notifications",
        "view_past_cars",
        "view_permision",
        "view_profile",
        "view_purchasedetails",
        "view_role",
        "view_sequence",
        "view_task_detail",
        "view_task",
        "view_user",
      ];

      for (let i = 0; i < roleArray.length; i++) {
        const permissionIdResult = await queryInterface.sequelize.query(
          `SELECT id FROM permissions WHERE slug = '${roleArray[i]}'`,
          { type: Sequelize.QueryTypes.SELECT }
        );

        if (permissionIdResult && permissionIdResult.length > 0) {
          const permissionId = permissionIdResult[0].id;

          const rolePermissionsData = {
            roleId: receiverRole[0].id,
            permissionId: permissionId,
          };

          await queryInterface.bulkInsert("rolepermissions", [
            rolePermissionsData,
          ]);
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // Add commands to revert seed here.
    // Example: await queryInterface.bulkDelete('People', null, {});
  },
};
