'use strict';

module.exports = () => {
     let propertyLike = {
          like: {
               type: Sequelize.INTEGER,
               primaryKey: true,
               autoIncrement: true,
          },
     };
     return sequelize.define('propertyLike', propertyLike);
};
