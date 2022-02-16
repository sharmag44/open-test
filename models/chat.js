'use strict';
module.exports = () => {
     var model = {
          id: {
               type: Sequelize.INTEGER,
               primaryKey: true,
               autoIncrement: true,
          },
          lastMessage: {
               type: Sequelize.TEXT('long'),
               allowNull: true,
               defaultValue: null,
          },
          user1: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          user2: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          user1MessageCount: {
               type: Sequelize.INTEGER,
               allowNull: true,
               defaultValue: null,
          },
          user2MessageCount: {
               type: Sequelize.INTEGER,
               allowNull: true,
               defaultValue: null,
          },
          status: {
               type: Sequelize.ENUM,
               values: ['active', 'inactive', 'deleted', 'blocked'],
               defaultValue: 'active',
          },
     };

     return sequelize.define('chat', model);
};
