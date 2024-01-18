"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const receiverRole = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = 'Quality Control Inspector'",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (receiverRole && receiverRole.length > 0) {
      const roleArray = [
        "View Task Detail",
        "Make Call",
        "Download Diagram",
        "Collaborate on Microsoft Whiteboard",
        "Review tasks",
        "Rejected Task",
        "Export tasks",
        "Export jobs",
        "Approved task",
        "Export tasks in PDF",
        "View notifications",
        "Export Inventory",
        "Edit Profile",
        "View profile",
        "View past CARs",
        "View rejected tasks",
        "Add CAR",
        "View inventory detail",
        "View inventory",
        "View dashboard with graphs",
        "View tasks",
        "View jobs",
      ];

      for (let i = 0; i < roleArray.length; i++) {
        const permissionIdResult = await queryInterface.sequelize.query(
          `SELECT id FROM permissions WHERE name = '${roleArray[i]}'`,
          { type: Sequelize.QueryTypes.SELECT }
        );

        if (permissionIdResult && permissionIdResult.length > 0) {
          const permissionId = permissionIdResult[0].id;

          const rolePermissionsData = {
            roleId: receiverRole[0].id,
            permissionId: permissionId,
            createdAt: new Date(),
            updatedAt: new Date(),
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
