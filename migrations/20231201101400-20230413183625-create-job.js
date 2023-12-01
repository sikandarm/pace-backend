'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.addColumn("jobs", "po_id", {
    type: Sequelize.INTEGER,
    allowNull: true,
  }),
    await queryInterface.addConstraint("jobs", {
      fields: ["po_id"], // Existing column in the table
      type: "foreign key",
      name: "ADD CONSTRAINT FK_PO_Job",
      references: {
        table: "purchaseorders", // The table to reference
        field: "id", // The column in the referenced table
      },
      onDelete: "cascade", // Set the desired onDelete behavior
      onUpdate: "cascade", // Set the desired onUpdate behavior
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    return Promise.all(
      [queryInterface.removeColumn("jobs", "po_id")],
      [queryInterface.removeConstraint("jobs", "po_id")]
    );

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
