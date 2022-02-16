'use strict';
const _ = require('underscore');
const userMapper = require('./user');
exports.toModel = (entity) => {
     if (Array.isArray(entity)) return this.toSearchModel(entity);
     const model = {
          id: entity.id,
          name: entity.name,
          model: entity.model,
          color: entity.color,
          price: entity.price,
          type: entity.type,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
     };
     if (entity.user) {
          model.userMapper = userMapper.toModel(entity.user);
     }

     return model;
};
exports.toSearchModel = (entities) => {
     return _.map(entities, exports.toModel);
};
