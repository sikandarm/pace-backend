'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
 up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('purchaseorders', {
      fields: ['userId'], // Existing column in the table
      type: 'foreign key',
      name: 'purchaseorders With User',
      references: {
        table: 'users', // The table to reference
        field: 'id', // The column in the referenced table
      },
      onDelete: 'cascade', // Set the desired onDelete behavior
      onUpdate: 'cascade', // Set the desired onUpdate behavior
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('purchaseorders', 'purchaseorders With User');
  },
};

