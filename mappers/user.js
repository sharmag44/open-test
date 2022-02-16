'use strict';
const _ = require('underscore');
const propertyMapper = require('./property');
exports.toModel = (entity) => {
     const model = {
          id: entity.id,
          name: entity.name,
          phone: entity.phone,
          countryCode: entity.countryCode,
          imgUrl: entity.imgUrl,
          email: entity.email,
          secondaryEmail: entity.secondaryEmail,
          googleId: entity.googleId,
          facebookId: entity.facebookId,
          isEmailVerified: entity.isEmailVerified,
          status: entity.status,
          role: entity.role,
          deviceId: entity.deviceId,
          deviceType: entity.deviceType,
          hasPassword: entity.password ? true : false,
     };

     if (entity.properties) {
          model.properties = propertyMapper.toModel(entity.properties);
     }
     return model;
};

exports.toSearchModel = (entities) => {
     return _.map(entities, exports.toModel);
};

exports.toAuthModel = (entity) => {
     let model = exports.toModel(entity);
     model.token = entity.token;
     return model;
};

exports.toSmallModel = (entity) => {
     const model = {
          id: entity.id,
          name: entity.name,
          email: entity.email,
          imgUrl: entity.imgUrl,
     };
     return model;
};
