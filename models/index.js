'use strict';
const fs = require('fs');
const path = require('path');
// @ts-ignore
const basename = path.basename(module.filename);

let initModels = () => {
     let db = {};
     fs.readdirSync(__dirname)
          .filter((file) => {
               return file.indexOf('.') !== 0 && file !== basename;
          })
          .forEach((file) => {
               const model = require(path.join(__dirname, file))(
                    sequelize,
                    Sequelize
               );
               db[model.name] = model;
               // model.sync({ alter: true });
          });

     Object.keys(db).forEach((modelName) => {
          if (db[modelName].associate) {
               db[modelName].associate(db);
          }
     });

     //a user have many properties
     db.user.hasMany(db.property);
     db.property.belongsTo(db.user);
     // users likes many properties
     db.user.hasMany(db.propertyLike);
     db.propertyLike.belongsTo(db.user);
     //property have many like
     db.property.hasMany(db.propertyLike);
     db.propertyLike.belongsTo(db.property);
     // user schedule the visit
     db.user.hasMany(db.schedule);
     db.schedule.belongsTo(db.user);
     // property is visited in sehedule
     db.property.hasMany(db.schedule);
     db.schedule.belongsTo(db.property);

     return db;
};
module.exports = initModels();
