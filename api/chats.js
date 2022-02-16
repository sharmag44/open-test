'use strict';
let mapper = require('../mappers/chat');
const updationScheme = require('../helpers/updateEntities');
const chatService = require('../services/chat');
const { Op } = require('sequelize');
const { baseServices } = require('../services');
const { IfEmpty } = require('../services/baseServices');
// @ts-ignore
const moment = require('moment');

exports.create = async (req, res) => {
     try {
          const model = req.body;
          const { user2Id, user1Id, propertyId } = model;
          IfEmpty(user1Id, 'user1Id');
          IfEmpty(user2Id, 'user2Id');
          IfEmpty(propertyId, 'propertyId');

          const user2 = await db.user.findOne({ where: { id: user2Id } });
          const user1 = await db.user.findOne({ where: { id: user1Id } });
          if (!user2 || !user1) throw 'User not preset';

          const isAlreadyExists = await chatService.checkChatIfAlreadyExist(
               model
          );

          if (isAlreadyExists) {
               return res.data(mapper.toModel(isAlreadyExists));
          }

          const newChat = await db.chat.create(model);
          newChat.user1name = user1.name || null;
          newChat.user2name = user2.name || null;
          await newChat.save();
          return res.data(mapper.toModel(newChat));
     } catch (error) {
          res.failure(error);
     }
};

exports.get = async (req, res) => {
     try {
          let chat = await db.chat.findOne({
               where: { id: req.params.id },
               include: [
                    {
                         model: db.user,
                         as: 'user1',
                    },
                    {
                         model: db.user,
                         as: 'user2',
                    },
                    {
                         model: db.user,
                         as: 'blockedBy',
                    },
                    db.property,
               ],
          });
          if (!chat) {
               return res.failure('Chat not found');
          }
          const userMessageCount =
               chat.user1.id === req.user.id
                    ? 'user1MessageCount'
                    : 'user2MessageCount';
          await db.chat.update(
               {
                    [userMessageCount]: 0,
               },
               { where: { id: req.params.id } }
          );
          chat.currentUserId = req.user.id;
          return res.data(mapper.toModel(chat));
     } catch (e) {
          return res.failure(e);
     }
};

exports.search = async (req, res) => {
     const { status, search } = req.query;
     let pageNo = req.query.pageNo ? Number(req.query.pageNo) : 1;
     let serverPaging = req.query.serverPaging == 'false' ? false : true;
     let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
     let offset = pageSize * (pageNo - 1);

     let query = {
          include: [
               db.property,
               {
                    model: db.user,
                    as: 'user1',
               },
               {
                    model: db.user,
                    as: 'user2',
               },
               {
                    model: db.user,
                    as: 'blockedBy',
               },
          ],
          distinct: true,
     };

     if (serverPaging) {
          query.limit = pageSize;
          query.offset = offset;
     }

     let where = {};

     where.lastMessage = {
          [Op.ne]: null,
     };

     where.status = {
          [Op.in]: ['active', 'blocked'],
     };
     where.blockedById = {
          [Op.or]: [null, req.user.id],
     };

     if (status) {
          where.status = status;
     }

     if (search) {
          where[Op.or] = [
               {
                    user1Id: req.user.id,
                    user2name: {
                         [Op.like]: `%${search}%`,
                    },
               },
               {
                    user2Id: req.user.id,
                    user1name: {
                         [Op.like]: `%${search}%`,
                    },
               },
          ];
     } else {
          where[Op.or] = [
               {
                    user1Id: req.user.id,
               },
               {
                    user2Id: req.user.id,
               },
          ];
     }
     query.order = [['updatedAt', 'DESC']];
     query.where = where;
     const result = await db.chat.findAndCountAll(query);
     return res.page(
          mapper.toSearchModel(result.rows, req.user.id),
          pageNo,
          pageSize,
          result.count
     );
};

exports.update = async (req, res) => {
     let model = req.body;
     try {
          let chat = await db.chat.findOne({
               where: { id: req.params.id },
               include: [],
          });
          if (!chat) {
               return res.failure('chat not found');
          }
          if (model.status == 'active') {
               if (chat.blockedById != req.user.id) {
                    return res.failure('You are blocked by other user');
               }
               model.blockedById = null;
          } else if (model.status == 'blocked') {
               if (chat.status == 'active') {
                    model.blockedById = req.user.id;
               } else if (chat.status == 'blocked') {
                    if (chat.blockedById != req.user.id) {
                         return res.failure('Already Blocked');
                    } else {
                         return res.failure('You are blocked by other user');
                    }
               }
          }
          chat = updationScheme.update(model, chat);
          chat = await chat.save();
          return res.data(mapper.toModel(chat));
     } catch (e) {
          return res.failure(e);
     }
};

exports.delete = async (req, res) => {
     try {
          let chat = await db.chat.findByPk(req.params.id);
          if (!chat) {
               return res.failure(`Chat not found`);
          }
          chat.status = 'deleted';
          await chat.save();
          return res.success('Chat deleted successfully ');
     } catch (err) {
          return res.failure(err);
     }
};

exports.updateLastMessage = async (req, res) => {
     if (!req.body.text) {
          return res.failure('text required');
     }

     try {
          let chat = await db.chat.findOne({
               where: { id: req.params.id },
               include: [],
          });
          if (!chat) throw 'chat not found';
          chat.lastMessage = req.body.text;
          chat.lastMessageUpdateTime = moment().utc().format();
          if (req.user.id === chat.user1Id) {
               chat.user2MessageCount += 1;
          }
          if (req.user.id === chat.user2Id) {
               chat.user1MessageCount += 1;
          }
          await chat.save();

          return res.data(mapper.toModel(chat));
     } catch (e) {
          return res.failure(e);
     }
};

exports.totalUnreadChatCount = async (req, res) => {
     const where = {
          status: 'active',
          [Op.or]: [
               { user1Id: req.user.id, user1MessageCount: { $gt: 0 } },
               { user2Id: req.user.id, user2MessageCount: { $gt: 0 } },
          ],
     };
     const chats = await db.chat.findAll({ where });
     res.data(chats.length);
};
