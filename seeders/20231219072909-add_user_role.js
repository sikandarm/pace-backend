"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const adminUser = await queryInterface.rawSelect(
      "users",
      {
        where: {
          firstName: "Admin",
        },
      },
      ["id"]
    );
    const adminRole = await queryInterface.rawSelect(
      "roles",
      {
        where: {
          name: "Admin",
        },
      },
      ["id"]
    );

    await queryInterface.bulkInsert(
      "userroles",
      [
        {
          userId: adminUser,
          roleId: adminRole,
        },
      ],
      {}
    );
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
