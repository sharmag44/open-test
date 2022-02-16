'use strict';
const _ = require('underscore');
const userMapper = require('./user');
const propertyMapper = require('./property');

exports.toModel = (entity) => {
     if (Array.isArray(entity)) {
          return this.toSearchModel(entity);
     }
     const model = {
          id: entity.id,
     };
     if (entity.user) {
          model.user = userMapper.toModel(entity.user);
     }
     if (entity.property) {
          model.property = propertyMapper.toModel(entity.property);
     }
     return model;
};
exports.toSearchModel = (entities) => {
     return _.map(entities, exports.toModel);
};
