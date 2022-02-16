'use strict';

module.exports = () => {
     let user = {
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
          email: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          verificationCode: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },

          isEmailVerified: {
               type: Sequelize.BOOLEAN,
               defaultValue: false,
          },
          countryCode: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          phoneNumber: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          password: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
               set: function (val) {},
          },
          token: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          imgUrl: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },

          role: {
               type: Sequelize.ENUM,
               values: ['user', 'admin'],
               defaultValue: 'user',
          },
          googleId: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },

          facebookId: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          status: {
               type: Sequelize.ENUM,
               values: ['active', 'inactive', 'deleted', 'blocked', 'pending'],
               defaultValue: 'pending',
          },
          deviceType: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          deviceId: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
     };
     return sequelize.define('user', user);
};
