'use strict';
const bcrypt = require('bcrypt-nodejs');
const { Op } = require('sequelize');

exports.checkUserFromEmail = async (email) => {
     var where = {
          [Op.or]: [],
     };
     if (email) {
          where[Op.or].push({ email: email });
     }
     return new Promise(async (resolve, reject) => {
          try {
               where.status = {
                    [Op.ne]: 'deleted',
               };
               let user = await db.user.findOne({ where: where });
               return resolve(user);
          } catch (err) {
               return resolve(null);
          }
     });
};

exports.checkUserExceptOne = async (user, email) => {
     var where = {
          email: email,
          id: { [Op.ne]: user.id },
     };
     return new Promise(async (resolve, reject) => {
          try {
               let user = await db.user.findOne({ where: where });
               if (user) {
                    return resolve(user);
               } else {
                    return resolve(null);
               }
          } catch (err) {
               return resolve(null);
          }
     });
};

exports.sendOTPonEmail = async (email, code, type) => {
     let msg = `Your OTP for Account Registration : ${code}. Do not share the Credentials for security reasons.`;
     if (type)
          msg = `Your forgot password otp is ${code}. Do not share the Credentials for security reasons.`;
     // return smtp.email(email, { body: msg });
};

exports.setPassword = (password) => {
     try {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(password, salt);
          return hash;
     } catch (error) {
          throw error;
     }
};

exports.comparePassword = (password, hash) => {
     try {
          return bcrypt.compareSync(password, hash);
     } catch (error) {
          throw error;
     }
};
