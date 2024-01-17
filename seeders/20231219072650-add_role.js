"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          name: "Admin",
        },
        {
          name: "CEO",
        },
        {
          name: "Receiver",
        },
        {
          name: "Shop Foreman",
        },
        {
          name: "Yardman",
        },
        {
          name: "Fitter",
        },
        {
          name: "Welder",
        },
        {
          name: "Painter",
        },
        {
          name: "Quality Control Inspector",
        },
        {
          name: "Quality Manager",
        },
        {
          name: "Operations Manager",
        },
        {
          name: "Project Manager",
        },
        {
          name: "Shipper",
        },
        {
          name: "Job Site Foreman",
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
