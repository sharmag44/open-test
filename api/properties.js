'use strict';
const model = 'property';

let mapper = require(`../mappers/${model}`);
const updationScheme = require('../helpers/updateEntities');
const { baseServices } = require('../services');
const { Op } = require('sequelize');
const { IfEmpty } = require('../services/baseServices');

exports.create = async (req, res) => {
     try {
          const { name, type, userId } = req.body;

          // empty checks
          baseServices.IfEmpty(name, 'name');
          baseServices.IfEmpty(type, 'type');
          baseServices.IfEmpty(userId, 'userId');

          const createdModel = await db[model].create(req.body);

          return res.data(mapper.toModel(createdModel));
     } catch (error) {
          res.failure(error);
     }
};

exports.update = async (req, res) => {
     try {
          const { id } = req.params;

          let foundModel = await baseServices.IfExists(model, {
               id,
          });

          //updating rest details

          foundModel = updationScheme.update(req.body, foundModel);
          foundModel = await foundModel.save();
          return res.data(mapper.toModel(foundModel));
     } catch (error) {
          res.failure(error);
     }
};

exports.get = async (req, res) => {
     try {
          const { id } = req.params;
          const { increaseView } = req.query;
          //find property if exists
          const foundModel = await db[model].findOne({
               where: {
                    id,
               },
               include: [
                    db.user,
                    {
                         model: db.propertyLike,
                         required: false,
                         where: {
                              userId: req.user.id,
                         },
                    },
               ],
          });

          if (increaseView) {
               foundModel.views += 1;
               await foundModel.save();
          }
          return res.data(mapper.toModel(foundModel));
     } catch (e) {
          return res.failure(e);
     }
};

exports.delete = async (req, res) => {
     try {
          //find user if exists
          const foundModel = await baseServices.IfExists(model, {
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
          const dayFilterArray = [
               'isMondayAvailable',
               'isTuesdayAvailable',
               'isWednesdayAvailable',
               'isThursdayAvailable',
               'isFridayAvailable',
               'isSaturdayAvailable',
               'isSundayAvailable',
          ];
          const {
               sortOrderWithProperty,
               status,
               getRecommended,
               statuses,
               fromCreatedAt,
               fromSqFt,
               toSqFt,
               noOfBedrooms,
               fromBedrooms,
               toBedrooms,
               fromBathrooms,
               toBathrooms,
               noOfBathrooms,
               userId,
               scheduleDate,
               scheduleTime,
               dayNameFilter,
               fromPrice,
               toPrice,
               latitude,
               longitude,
               radius,
          } = req.query;
          let pageNo = req.query.pageNo ? Number(req.query.pageNo) : 1;
          let serverPaging = req.query.serverPaging == 'false' ? false : true;
          let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
          let offset = pageSize * (pageNo - 1);
          let totalRecords = 0;

          if (dayNameFilter && !dayFilterArray.includes(dayNameFilter)) {
               throw 'Please enter a valid filter';
          }

          let query = {
               include: [
                    db.user,
                    {
                         model: db.propertyLike,
                         required: false,
                         where: {
                              userId: userId || req.user.id,
                         },
                    },
               ],
          };
          if (serverPaging) {
               query.limit = pageSize;
               query.offset = offset;
          }

          let where = {};

          if (userId) {
               where.userId = userId;
          }

          if (dayNameFilter) {
               where[dayNameFilter] = true;
          }

          if (fromCreatedAt) {
               where.fromCreatedAt = {
                    [Op.gte]: fromCreatedAt,
               };
          }

          if (fromSqFt && toSqFt) {
               where.squareFootage = {
                    [Op.between]: [fromSqFt, toSqFt],
               };
          }

          if (fromPrice && toPrice) {
               where.price = {
                    [Op.between]: [fromPrice, toPrice],
               };
          }

          if (noOfBedrooms) {
               where.noOfBedrooms = noOfBedrooms;
          }

          if (fromBathrooms && toBathrooms) {
               where.noOfBathrooms = {
                    [Op.between]: [fromBathrooms, toBathrooms],
               };
          }

          if (fromBedrooms && toBedrooms) {
               where.noOfBedrooms = {
                    [Op.between]: [fromBedrooms, toBedrooms],
               };
          }

          if (noOfBathrooms) {
               where.noOfBathrooms = noOfBathrooms;
          }

          if (status) {
               where.status = status;
          }
          //statuses = sold,published => [sold,published]
          if (statuses) {
               where.statuses = {
                    [Op.in]: statuses.split(','),
               };
          }

          if (scheduleDate) {
               where[Op.and] = [
                    {
                         scheduleStartDate: {
                              [Op.gte]: scheduleDate,
                         },
                    },
                    {
                         scheduleEndDate: {
                              [Op.lte]: scheduleDate,
                         },
                    },
               ];
          }

          if (scheduleTime) {
               where[Op.and] = [
                    {
                         scheduleStartTime: {
                              [Op.gte]: scheduleTime,
                         },
                    },
                    {
                         scheduleEndTime: {
                              [Op.lte]: scheduleTime,
                         },
                    },
               ];
          }

          if (latitude && longitude) {
               const attributes = Object.keys(db.property.rawAttributes);
               const location = sequelize.literal(
                    `ST_GeomFromText('POINT(${parseFloat(
                         longitude
                    )} ${parseFloat(latitude)})')`
               );
               const distance = sequelize.fn(
                    'ST_Distance_Sphere',
                    sequelize.literal('locationCoordinates'),
                    location
               );
               // @ts-ignore
               attributes.push([distance, 'distance']);
               query.attributes = attributes;
               if (getRecommended) {
                    query.order = [
                         distance,
                         ['price', 'ASC'],
                         ['noOfBedrooms', 'DESC'],
                         ['squareFootage', 'DESC'],
                    ];
               } else {
                    query.order = distance;
               }
               where.distance = sequelize.where(distance, {
                    [Op.lte]: +radius || 5000,
               });
          }

          if (!(latitude && longitude)) {
               if (sortOrderWithProperty) {
                    query.order = [sortOrderWithProperty.split(',')];
               } else {
                    query.order = [['id', 'DESC']];
               }
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

exports.likeDislike = async (req, res) => {
     try {
          const { userId, propertyId } = req.body;

          IfEmpty(userId, 'userId');
          IfEmpty(propertyId, 'propertyId');

          const foundModel = await db.propertyLike.findOne({
               where: {
                    userId,
                    propertyId,
               },
          });

          if (foundModel) {
               await foundModel.destroy();
               return res.success('property unliked');
          }
          await db.propertyLike.create({ userId, propertyId });
          return res.success('property liked');
     } catch (error) {
          res.failure(error);
     }
};
