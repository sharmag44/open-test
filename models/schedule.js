'use strict';

module.exports = () => {
     let schedule = {
          id: {
               type: Sequelize.INTEGER,
               primaryKey: true,
               autoIncrement: true,
               unique: true,
          },
          date: {
               type: Sequelize.DATE,
               allowNull: true,
               defaultValue: null,
          },
          scheduleTimeFrom: {
               type: Sequelize.DATE,
               allowNull: true,
               defaultValue: null,
          },
          scheduleTimeTo: {
               type: Sequelize.DATE,
               allowNull: true,
               defaultValue: null,
          },
          status: {
               type: Sequelize.ENUM,
               values: [
                    'pending',
                    'approved',
                    'rejected',
                    'published',
                    'drafted',
               ],
               defaultValue: 'pending',
          },
     };
     return sequelize.define('schedule', schedule);
};
