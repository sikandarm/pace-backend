"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const adminRole = await queryInterface.rawSelect(
      "roles",
      {
        where: {
          name: "Admin",
        },
      },
      ["id"]
    );

    const permissionIds = await queryInterface.sequelize.query(
      "SELECT id FROM permissions",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    const rolePermissionsData = permissionIds.map((permission) => ({
      roleId: adminRole,
      permissionId: permission.id,
    }));

    await queryInterface.bulkInsert("rolepermissions", rolePermissionsData, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
