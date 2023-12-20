"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("pace123", 10); // Hashing the password

    await queryInterface.bulkInsert(
      "users",
      [
        {
          firstName: "Admin",
          lastName: "Admin",
          email: "admin@pace.com",
          password: hashedPassword,
          isActive: 1,
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
