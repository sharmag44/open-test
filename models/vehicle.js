'use strict';
module.exports = () => {
     var model = {
          id: {
               type: Sequelize.INTEGER,
               primaryKey: true,
               autoIncrement: true,
               unique: true,
          },
          name: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },

          model: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          color: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          price: {
               type: Sequelize.INTEGER,
               allowNull: true,
               defaultValue: null,
          },
          type: {
               type: Sequelize.ENUM,
               values: ['car', 'motorcycle', 'truck', 'bus', 'van', 'other'],
               defaultValue: 'car',
          },
     };

     return sequelize.define('vehicle', model);
};
