"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.addConstraint("bill_of_ladings", {
        fields: ["company_id"], // Existing column in the table
        type: "foreign key",
        name: "ADD CONSTRAINT FK_Bill_of_Lading_Company",
        references: {
          table: "companies", // The table to reference
          field: "id", // The column in the referenced table
        },
        onDelete: "cascade", // Set the desired onDelete behavior
        onUpdate: "cascade", // Set the desired onUpdate behavior
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "bill_of_ladings",
      "ADD CONSTRAINT FK_Bill_of_Lading_Company"
    );
  },
};
