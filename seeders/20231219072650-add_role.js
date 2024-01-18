"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          name: "Admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "CEO",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Receiver",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Shop Foreman",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Yardman",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Fitter",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Welder",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Painter",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Quality Control Inspector",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Quality Manager",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Operations Manager",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Project Manager",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Shipper",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Job Site Foreman",
          createdAt: new Date(),
          updatedAt: new Date(),
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
