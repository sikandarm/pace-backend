"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const receiverRole = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = 'Job Site Foreman'",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (receiverRole && receiverRole.length > 0) {
      const roleArray = ["View notifications", "Edit Profile", "View profile"];

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
