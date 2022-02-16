'use strict';
const dbConfig = require('config').get('db');
global.Sequelize = require('sequelize');
const wkx = require('wkx');

module.exports.configure = async ({ force = false }) => {
     try {
          configDb();
          let sequelize = new Sequelize(
               dbConfig.database,
               dbConfig.username,
               dbConfig.password,
               {
                    host: dbConfig.host,
                    port: dbConfig.port,
                    dialect: dbConfig.dialect,
                    logging: false,
               }
          );
          global.sequelize = sequelize;
          global.db = require('../models');

          await sequelize.sync({ alter: true, force });
          console.log('db connected');
          return sequelize;
     } catch (error) {
          console.log(error);
          console.log('DB Connection Failed');
     }
};

const configDb = () => {
     Sequelize.GEOMETRY.prototype._stringify = function _stringify(
          value,
          options
     ) {
          return `ST_GeomFromText(${options.escape(
               wkx.Geometry.parseGeoJSON(value).toWkt()
          )})`;
     };
     Sequelize.GEOMETRY.prototype._bindParam = function _bindParam(
          value,
          options
     ) {
          return `ST_GeomFromText(${options.bindParam(
               wkx.Geometry.parseGeoJSON(value).toWkt()
          )})`;
     };
     Sequelize.GEOGRAPHY.prototype._stringify = function _stringify(
          value,
          options
     ) {
          return `ST_GeomFromText(${options.escape(
               wkx.Geometry.parseGeoJSON(value).toWkt()
          )})`;
     };
     Sequelize.GEOGRAPHY.prototype._bindParam = function _bindParam(
          value,
          options
     ) {
          return `ST_GeomFromText(${options.bindParam(
               wkx.Geometry.parseGeoJSON(value).toWkt()
          )})`;
     };
};
