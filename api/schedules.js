'use strict';
const model = 'schedule';
let mapper = require('../mappers/' + model);
const updationScheme = require('../helpers/updateEntities');
const { baseServices } = require('../services');
const { Op } = require('sequelize');
const moment = require('moment');
const { IfEmpty, IfExists } = require('../services/baseServices');
const property = require('../models/property');

exports.create = async (req, res) => {
     try {
          const { userId, propertyId, date, scheduleTimeFrom, scheduleTimeTo } =
               req.body;
          IfEmpty(userId, 'userId');
          IfEmpty(propertyId, 'propertyId');
          IfEmpty(date, 'date');
          IfEmpty(scheduleTimeFrom, 'scheduleTimeFrom');
          IfEmpty(scheduleTimeTo, 'scheduleTimeTo');

          const schedule = await db.schedule.findOne({
               where: {
                    date,
                    scheduleTimeFrom,
                    scheduleTimeTo,
                    propertyId,
                    status: 'approved',
               },
          });
          if (schedule) throw 'Schedule already exists';
          const createModel = await db[model].create(req.body);
          return res.data(mapper.toModel(createModel));
     } catch (err) {
          res.failure(err);
     }
};

exports.update = async (req, res) => {
     try {
          const { id } = req.params;
          const { status } = req.body;
          let foundModel = await IfExists(model, { id });
          if (status === 'approved') {
               db.schedule.update(
                    {
                         status: 'rejected',
                    },
                    {
                         where: {
                              id: {
                                   [Op.ne]: foundModel.id,
                              },
                              date: foundModel.date,
                              startTime: foundModel.startTime,
                              endTime: foundModel.endTime,
                              propertyId: foundModel.propertyId,
                         },
                    }
               );
          }
          return res.data(mapper.toModel(foundModel));
     } catch (err) {}
};

exports.getScheduleList = async (req, res) => {
     try {
          const { propertyId, date } = req.query;
          IfEmpty(propertyId, 'propertyId');
          IfEmpty(date, 'date');
          const property = await db.property.findOne({
               where: {
                    id: propertyId,
               },
          });
          if (!property) throw 'Property Not found';
          const schedules = await db.schedule.findAll({
               where: {
                    propertyId,
                    date,
                    status: 'approved',
               },
          });
          const slotList = [];
          let startTime = moment(property.scheduleTimeFrom);
          let endTime = moment(property.scheduleTimeTo);
          do {
               const foundSchedule = schedules.find((schedule) => {
                    return (
                         moment(schedules.startTime).utc().format('HH:mm') ==
                         startTime.utc().format('HH:mm')
                    );
               });
               if (foundSchedule) {
                    startTime.add(60, 'minutes').utc().format();
               } else {
                    slotList.push({
                         startTime: startTime.utc().format('HH:mm'),
                         endTime: startTime.add(60, 'minutes').utc().format(),
                    });
               }
          } while (startTime.isBefore(endTime));
          return res.data(slotList, 1, 1, 1, 1);
     } catch (err) {
          res.failure(err);
     }
};
exports.get = async (req, res) => {
     try {
          const { id } = req.params;
          const foundModel = await baseServices.IfExists(model, {
               id,
          });
          return res.data(mapper.toModel(foundModel));
     } catch (e) {
          return res.failure(e);
     }
};

exports.delete = async (req, res) => {
     try {
          //check user if exists
          const foundModel = await IfExists(model, {
               id: req.params.id,
          });
          await foundModel.destroy();
          return res.success(`model deleted successfully `);
     } catch (err) {
          return res.failure(err);
     }
};

exports.search = async (req, res) => {
     try {
          const { sortOrderWithProperty } = req.query;
          let pageNo = req.query.pageNo ? Number(req.query.pageNo) : 1;
          let serverPaging = req.query.serverPaging == 'false' ? false : true;
          let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
          let offset = pageSize * (pageNo - 1);
          let totalRecords = 0;

          let query = {
               include: [],
          };
          if (serverPaging) {
               query.limit = pageSize;
               query.offset = offset;
          }

          let where = {};

          if (sortOrderWithProperty) {
               query.order = [sortOrderWithProperty.split(',')];
          } else {
               query.order = [['id', 'DESC']];
          }
          query.where = where;
          const result = await db[model].findAndCountAll(query);
          return res.page(
               mapper.toSearchModel(result.rows),
               pageNo,
               pageSize,
               result.count
          );
     } catch (error) {
          res.failure(error);
     }
};
