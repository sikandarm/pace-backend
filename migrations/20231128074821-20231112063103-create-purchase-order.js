'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('purchaseorders', 'status', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ],
    [
      queryInterface.addColumn('purchaseorders', 'userId', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ]
    
    );
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([queryInterface.removeColumn('purchaseorders', 'status')],
    [queryInterface.removeColumn('purchaseorders', 'userId')]
    );
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
