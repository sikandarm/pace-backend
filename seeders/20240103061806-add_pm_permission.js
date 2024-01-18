"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const receiverRole = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = 'Project Manager'",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (receiverRole && receiverRole.length > 0) {
      const roleArray = [
        "View Task Detail",
        "View notifications",
        "Edit Profile",
        "View profile",
        "View past CARs",
        "View inventory detail",
        "View inventory",
        "Export Inventory",
        "View jobs",
        "View tasks",
        "Edit Sequence",
        "View Sequence",
        "Delete Sequence",
        "Add Sequence",
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
