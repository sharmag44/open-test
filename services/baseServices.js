// @ts-ignore
const _ = require('underscore');
const smtp = require('../providers/smtp');
const { Op } = require('sequelize');

exports.checkModel = (req, modelName) => {
     try {
          if (!req[modelName] || !req[modelName].id) {
               throw 'Invalid token';
          }
     } catch (error) {
          throw error;
     }
};

exports.IfEmpty = (value, key) => {
     if (!value) throw `${key} is required`;
};

exports.IfExists = async (model, where, message) => {
     try {
          const findEntity = await db[model].findOne({ where });
          if (!findEntity) {
               throw message || `${model} not found`;
          }
          return findEntity;
     } catch (error) {
          throw error;
     }
};

exports.IfAlreadyExists = async (model, where, message) => {
     try {
          const findEntity = await db[model].findOne({ where });
          if (findEntity) {
               if (message) {
                    throw message;
               }
               throw `${model} already exists`;
          }
     } catch (error) {
          throw error;
     }
};

exports.generateOTP = (length = 5) => {
     return Math.floor(Math.random() * 90000) + Math.pow(10, length - 1);
};

// @ts-ignore
exports.sendOTPonPhone = async (phoneNumber, code) => {
     // return twilio.send(phoneNumber, code);
     console.log('phone Otp service pending');
};

exports.sendInvite = async (email, user) => {
     let msg = `You have been invited to join the Esusu App. referral Code = ${user.referralCode}.`;
     return smtp.email(email, { body: msg });
};

exports.sendForgotOTP = async (email, code) => {
     let msg = `Your OTP for Forgot Password in Esusu App is: ${code}. Do not share the Credentials for security reasons.`;
     return smtp.email(email, { body: msg });
};

exports.addDevice = async ({ deviceType, deviceId, id }, type) => {
     try {
          const idName = `${type}Id`;
          if (!deviceType || !deviceId) {
               return;
          }
          // @ts-ignore
          await db.device.destroy({
               where: { [Op.or]: { deviceId, [idName]: id } },
          });
          // @ts-ignore
          await db.device.create({
               [idName]: id,
               deviceType,
               deviceId,
          });
     } catch (error) {
          throw error;
     }
};
