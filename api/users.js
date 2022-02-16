'use strict';
const model = 'user';
let mapper = require(`../mappers/${model}`);
const { Op } = require('sequelize');
const updationScheme = require('../helpers/updateEntities');
const { getUserToken } = require('../middlewares/authorization');
const defaultActivationCode = require('config').get('defaultActivationCode');
const { IfEmpty, IfExists } = require('../services/baseServices');
const { baseServices, userServices } = require('../services');
const {
     signUpOTP,
     forgotPasswordOTP,
     resendOTP,
} = require('../services/mailService');

exports.signUp = async (req, res) => {
     try {
          const { loginType, email, password, deviceType, deviceId } = req.body;
          const errors = req.errors[model];
          let socialMediaIdKey, socialMediaIdValue, user;
          const loginTypes = ['email', 'facebook', 'google'];

          // checks if it is empty
          IfEmpty(loginType, 'loginType');
          IfEmpty(deviceId, 'deviceId');
          IfEmpty(deviceType, 'deviceType');

          if (!loginTypes.includes(loginType)) throw errors.validLoginType;

          if (loginType === 'email') {
               IfEmpty(email, 'email');
               IfEmpty(password, 'password');
          } else {
               socialMediaIdKey = `${loginType}Id`;
               socialMediaIdValue = req.body[socialMediaIdKey];
               if (!socialMediaIdValue) throw errors.validSocialMediaId;
          }

          if (loginType === 'facebook') {
               user = await db.user.findOne({
                    where: {
                         [socialMediaIdKey]: socialMediaIdValue,
                    },
               });
          } else {
               user = await db.user.findOne({
                    where: {
                         email,
                    },
               });
          }

          if (!user) {
               user = await db.user.create({
                    email,
                    loginType,
                    [socialMediaIdKey]: socialMediaIdValue,
               });
          }
          if (
               user.status === 'active' &&
               loginType === 'email' &&
               user.password
          )
               throw errors.statusActiveError;
          if (user.status === 'blocked') throw errors.statusBlockedError;
          if (user.status === 'deleted') throw errors.statusDeletedError;

          user = updationScheme.update(
               { ...req.body, loginType: user.loginType },
               userServices.setPassword(user.password)
          );

          if (loginType === 'email' && !user.isEmailVerified) {
               user.password = userServices.setPassword(password);
               user.activationCode = baseServices.generateOTP();
               user.token = null;

               await signUpOTP({
                    email: user.email,
                    code: user.activationCode,
               });
          } else {
               user.status = 'active';
               user.activationCode = null;
               user.token = getUserToken(user);
               user.deviceId = deviceId;
               user.deviceType = deviceType;
          }

          user = await user.save();

          return res.data(mapper.toAuthModel(user));
     } catch (error) {
          res.failure(error);
     }
};

exports.verification = async (req, res) => {
     try {
          const errors = req.errors[model];
          const { userId, activationCode, deviceId, deviceType } = req.body;

          baseServices.IfEmpty(userId, 'userId');
          baseServices.IfEmpty(activationCode, 'activationCode');
          baseServices.IfEmpty(deviceType, 'deviceType');
          baseServices.IfEmpty(deviceId, 'deviceId');

          let user = await baseServices.IfExists(model, {
               id: userId,
          });

          if (
               activationCode !== defaultActivationCode &&
               activationCode !== user.activationCode
          )
               throw errors.invalidOTP;

          user.status = 'active';
          user.isEmailVerified = true;
          user.activationCode = null;

          user.deviceId = deviceId;
          user.deviceType = deviceType;
          user.token = getUserToken(user);
          user = await user.save();
          // templateData.welcomeEmail(user);

          res.data(mapper.toAuthModel(user));
     } catch (error) {
          res.failure(error);
     }
};

exports.signIn = async (req, res) => {
     try {
          const errors = req.errors[model];
          const { email, password, deviceId, deviceType } = req.body;

          IfEmpty(email, 'email');
          IfEmpty(password, 'password');
          IfEmpty(deviceId, 'deviceId');
          IfEmpty(deviceType, 'deviceType');

          let user = await db.user.findOne({ where: { email } });
          if (!user) throw errors.validCredError;
          if (!user.password) throw errors.loginUsingSocialMedia;
          if (user.status === 'pending') throw errors.statusPendingError;
          if (user.status === 'deleted') throw errors.statusDeletedError;
          if (user.status === 'blocked') throw errors.statusBlockedError;
          if (user.status === 'suspended') user.status = 'active';

          const isPasswordMatch = userServices.comparePassword(
               password,
               user.password
          );
          if (!isPasswordMatch) throw errors.validCredError;

          user.deviceId = deviceId;
          user.deviceType = deviceType;
          user.token = getUserToken(user);
          user = await user.save();

          res.data(mapper.toAuthModel(user));
     } catch (error) {
          res.failure(error);
     }
};

exports.forgotPassword = async (req, res) => {
     try {
          const errors = req.errors[model];

          const { email } = req.body;

          baseServices.IfEmpty(email, 'email');

          const user = await baseServices.IfExists(
               model,
               { email },
               errors.emailNotRegistered
          );

          if (user.status === 'deleted') throw errors.statusDeletedError;
          if (user.status === 'blocked') throw errors.statusBlockedError;
          user.activationCode = baseServices.generateOTP();
          await forgotPasswordOTP({
               email: user.email,
               code: user.activationCode,
          });
          await user.save();
          res.data(mapper.toModel(user));
     } catch (error) {
          res.failure(error);
     }
};

exports.updatePassword = async (req, res) => {
     try {
          const errors = req.errors[model];

          const { newPassword, oldPassword } = req.body;
          //empty checks
          baseServices.IfEmpty(newPassword, 'newPassword');

          //find user
          const user = await baseServices.IfExists(model, {
               id: req.params.id,
          });

          // compare if old password exists
          if (oldPassword) {
               const isPasswordMatch = userServices.comparePassword(
                    oldPassword,
                    user.password
               );
               if (!isPasswordMatch) throw errors.oldPassIncorrect;
          }
          user.password = newPassword;

          await user.save();
          return res.data(mapper.toModel(user));
     } catch (e) {
          return res.failure(e);
     }
};

exports.resend = async (req, res) => {
     try {
          const { userId } = req.body;
          baseServices.IfEmpty(userId, 'userId');

          const user = await baseServices.IfExists(model, {
               id: userId,
          });
          user.activationCode = baseServices.generateOTP();
          await user.save();

          await resendOTP({
               email: user.email,
               code: user.activationCode,
          });
          return res.data(mapper.toModel(user));
     } catch (e) {
          return res.failure(e);
     }
};

exports.resendForgot = async (req, res) => {
     try {
          const { userId } = req.body;
          IfEmpty(userId, 'userId');

          const user = await IfExists(model, {
               id: userId,
          });
          user.activationCode = baseServices.generateOTP();
          await user.save();

          await resendOTP({
               email: user.email,
               code: user.activationCode,
          });
          return res.data(mapper.toModel(user));
     } catch (e) {
          return res.failure(e);
     }
};

/**
 *
 * @param {Object} req
 * @param {UserI} req.user
 * @param {UserI} req.body
 * @param {UserI} req.params
 * @returns
 */
exports.update = async (req, res) => {
     try {
          const { id } = req.params;

          /**
           * @type {UserI}
           */
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
          let foundModel = await db[model].findOne({
               where: {
                    id,
               },
               include: [db.property],
          });

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
          return res.success(`${model} deleted successfully `);
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
          let offset = +req.query.offset || pageSize * (pageNo - 1);

          let query = {
               include: [],
               distinct: true,
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
          result.rows.map((user) => console.log(user.email));

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

exports.checkValidEmail = async (req, res) => {
     try {
          const { email, checkWithSecondaryEmail } = req.query;
          let user = await db.user.findOne({
               where: {
                    email: email,
                    status: {
                         [Op.ne]: 'pending',
                    },
               },
          });
          if (!user && checkWithSecondaryEmail) {
               user = await db.user.findOne({
                    where: {
                         secondaryEmail: email,
                         status: {
                              [Op.ne]: 'pending',
                         },
                    },
               });
          }
          if (!user) {
               return res.data({ doesUserExists: false });
          }
          return res.data({ doesUserExists: true });
     } catch (err) {
          return res.failure(err);
     }
};

exports.checkUserWithFacebook = async (req, res) => {
     try {
          let user = await db.user.findOne({
               where: {
                    facebookId: req.query.facebookId,
                    status: {
                         [Op.ne]: 'deleted',
                    },
               },
          });
          if (!user) {
               return res.data({ doesUserExists: false });
          }
          return res.data({ doesUserExists: true });
     } catch (err) {
          return res.failure(err);
     }
};

exports.checkUserWithGoogle = async (req, res) => {
     try {
          let user = await db.user.findOne({
               where: {
                    googleId: req.query.googleId,
                    status: {
                         [Op.ne]: 'deleted',
                    },
               },
          });
          if (!user) {
               return res.data({ doesUserExists: false });
          }
          return res.data({
               doesUserExists: true,
          });
     } catch (err) {
          return res.failure(err);
     }
};
