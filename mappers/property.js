'use strict';
const _ = require('underscore');
const userMapper = require('./user');

exports.toModel = (entity) => {
     if (Array.isArray(entity)) {
          return this.toSearchModel(entity);
     }
     const model = {
          id: entity.id,
          type: entity.type,
          zipcode: entity.zipCode,
          city: entity.city,
          state: entity.state,
          street: entity.street,
          sqFoot: entity.sqFoot,
          price: entity.price,
          attendacees: entity.attendacees,
          description: entity.description,
          bedrooms: entity.bedrooms,
          bathrooms: entity.bathrooms,
          parkingSpot: entity.parkingSpot,
          otherSpace: entity.otherSpace,
          image: entity.image,
          scheduleDateFrom: entity.scheduleDateFrom,
          scheduleDateTo: entity.scheduleDateTo,
          scheduleTimeFrom: entity.scheduleTimeFrom,
          scheduleTimeTo: entity.scheduleTimeTo,
          isMondayAvailable: entity.isMondayAvailable,
          isTuesdayAvailable: entity.isTuesdayAvailable,
          isWednesdayAvailable: entity.isWednesdayAvailable,
          isThursdayAvailable: entity.isThursdayAvailable,
          isFridayAvailable: entity.isFridayAvailable,
          isSaturdayAvailable: entity.isSaturdayAvailable,
          isSundayAvailable: entity.isSundayAvailable,
          createAt: entity.createAt,
          status: entity.status,
     };
     if (entity.user) {
          model.user = userMapper.toModel(entity.user);
     }
};

exports.toSearchModel = (entities) => {
     return _.map(entities, exports.toModel);
};
