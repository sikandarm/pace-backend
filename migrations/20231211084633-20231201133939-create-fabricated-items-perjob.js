"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("fabricated_items_perjobs", "poitems_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    }),
      await queryInterface.addConstraint("fabricated_items_perjobs", {
        fields: ["poitems_id"], // Existing column in the table
        type: "foreign key",
        name: "ADD CONSTRAINT FK_FabricatedItems_POItems",
        references: {
          table: "purchase_order_items", // The table to reference
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

  async down(queryInterface, Sequelize) {
    return Promise.all(
      [queryInterface.removeColumn("fabricated_items_perjobs", "poitems_id")],
      [
        queryInterface.removeConstraint(
          "fabricated_items_perjobs",
          "poitems_id"
        ),
      ]
    );

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
