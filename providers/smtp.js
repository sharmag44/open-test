'use strict';
var nodemailer = require('nodemailer');
const smtp = require('config').get('providers.smtp');

exports.email = async (toEmail, message) => {
     if (!toEmail) {
          return Promise.reject('to email is required');
     }
     if (!message) {
          return Promise.reject('message is required');
     }
     if (!message.body) {
          return Promise.reject('message.body is required');
     }
     let data = {
          to: toEmail,
          subject: message.subject || 'esusu',
          html: message.body,
          from: '',
     };

     let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
               user: smtp.email,
               pass: smtp.pass,
          },
     });

     try {
          let info = await transporter.sendMail(data);
          console.log(info);
     } catch (err) {
          console.log(err);
     }
};
