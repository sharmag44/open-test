'use strict';

const _ = require('underscore');
const userMapper = require('./user');
const propertyMapper = require('./property');
const { user } = require('../locale/errors/en');

exports.toModel = (entity) => {
     if (Array.isArray(entity)) {
          return this.toSearchModel(entity);
     }
     const model = {
          id: entity.id,
          date: entity.date,
          time: entity.time,
          scheduleTimeFrom: entity.scheduleTimeFrom,
          scheduleTimeTo: entity.scheduleTimeTo,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
          status: entity.status,
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
