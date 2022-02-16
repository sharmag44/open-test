'use strict';
exports.update = (entitiesToUpdate, existingModel) => {
     //both comming as object
     for (var key in entitiesToUpdate) {
          if (
               entitiesToUpdate[key] ||
               typeof entitiesToUpdate[key] === 'boolean'
          ) {
               existingModel[key] = entitiesToUpdate[key]; //change if exist otherwise add in it
          } else if (
               entitiesToUpdate[key] ||
               entitiesToUpdate[key] === 0 ||
               entitiesToUpdate[key] === 0.0
          ) {
               existingModel[key] = 0;
          } else if (!entitiesToUpdate[key]) {
               existingModel[key] = null;
          }
     }
     return existingModel;
};