'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Eventcarowners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      eventid: {
        type: Sequelize.INTEGER,
        references: {
          model: "Events",
          key:  "id"  
        },
        onUpdate: "Cascade",
        onDelete: "Cascade"
      },
      ownerid: {
        type: Sequelize.INTEGER,
        references: {
          model: "CarOwners",
          key:  "id"  
        },
        onUpdate: "Cascade",
        onDelete: "Cascade"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Eventcarowners');
  }
};