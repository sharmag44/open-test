'use strict';
module.exports = () => {
     var model = {
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
          type: {
               type: Sequelize.ENUM,
               values: [
                    'house',
                    'townhome',
                    'apartment',
                    'condo',
                    'multiFamily',
                    'manufactured',
               ],
               defaultValue: 'house',
          },
          zip: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          city: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          state: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          address: {
               type: Sequelize.TEXT('long'),
               allowNull: true,
               defaultValue: null,
          },
          squareFootage: {
               type: Sequelize.INTEGER,
               allowNull: true,
               defaultValue: 0,
          },
          price: {
               type: Sequelize.INTEGER,
               allowNull: true,
               defaultValue: 0,
          },
          attendings: {
               type: Sequelize.INTEGER,
               allowNull: true,
               defaultValue: 0,
          },
          description: {
               type: Sequelize.TEXT('long'),
               allowNull: true,
               defaultValue: null,
          },
          noOfBedrooms: {
               type: Sequelize.INTEGER,
               allowNull: true,
               defaultValue: 0,
          },
          noOfBathrooms: {
               type: Sequelize.INTEGER,
               allowNull: true,
               defaultValue: 0,
          },
          noOfParkingSpots: {
               type: Sequelize.INTEGER,
               allowNull: true,
               defaultValue: 0,
          },
          locationCoordinates: {
               type: Sequelize.GEOMETRY('POINT'),
               allowNull: true,
               defaultValue: null,
               // @ts-ignore
               set: function ({ lng, lat } = {}) {
                    if (lng && lat) {
                         this.setDataValue('locationCoordinates', {
                              type: 'Point',
                              coordinates: [lng, lat],
                         });
                    }
               },
               get: function () {
                    const locationCoordinates = this.getDataValue(
                         'locationCoordinates'
                    );
                    if (
                         !locationCoordinates ||
                         !locationCoordinates.coordinates
                    )
                         return null;
                    return {
                         lng: locationCoordinates.coordinates[0],
                         lat: locationCoordinates.coordinates[1],
                    };
               },
          },
          views: {
               type: Sequelize.INTEGER,
               allowNull: true,
               defaultValue: 0,
          },
          otherAreas: {
               type: Sequelize.JSON,
               allowNull: true,
               defaultValue: null,
          },
          scheduleStartDate: {
               type: Sequelize.DATE,
               allowNull: true,
               defaultValue: null,
          },
          scheduleEndDate: {
               type: Sequelize.DATE,
               allowNull: true,
               defaultValue: null,
          },
          scheduleStartTime: {
               type: Sequelize.DATE,
               allowNull: true,
               defaultValue: null,
          },
          scheduleEndTime: {
               type: Sequelize.DATE,
               allowNull: true,
               defaultValue: null,
          },
          isMondayAvailable: {
               type: Sequelize.BOOLEAN,
               allowNull: true,
               defaultValue: false,
          },
          isTuesdayAvailable: {
               type: Sequelize.BOOLEAN,
               allowNull: true,
               defaultValue: false,
          },
          isWednesdayAvailable: {
               type: Sequelize.BOOLEAN,
               allowNull: true,
               defaultValue: false,
          },
          isThursdayAvailable: {
               type: Sequelize.BOOLEAN,
               allowNull: true,
               defaultValue: false,
          },
          isFridayAvailable: {
               type: Sequelize.BOOLEAN,
               allowNull: true,
               defaultValue: false,
          },
          isSaturdayAvailable: {
               type: Sequelize.BOOLEAN,
               allowNull: true,
               defaultValue: false,
          },
          isSundayAvailable: {
               type: Sequelize.BOOLEAN,
               allowNull: true,
               defaultValue: false,
          },
          autoApproval: {
               type: Sequelize.BOOLEAN,
               allowNull: true,
               defaultValue: false,
          },
          images: {
               type: Sequelize.JSON,
               allowNull: true,
               defaultValue: null,
          },
          status: {
               type: Sequelize.ENUM,
               values: ['sold', 'deleted', 'published', 'drafted'],
          },
     };

     return sequelize.define('property', model);
};
