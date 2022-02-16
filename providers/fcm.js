'use strict';
var fcmConfig = require('config').get('providers.fcm');
var FCM = require('fcm-node');
var fcm = new FCM(fcmConfig.serverKey);

exports.sendIOSPush = function (fcmToken, message, cb) {
     var message = {
          to: fcmToken,
          data: {
               title: message.title,
               content: message.text,
               imgUrl: message.imgUrl,
               entityId: message.entityId,
               entityName: message.entityName,
               dataId: message.dataId,
               dataName: message.dataName
          },
          notification: {
               title: message.title,
               body: message.text,
               sound: 'default'
          },
          content_available: true,
          mutable_content: true,
          priority: "high",
          sound: 'default'
     };
     fcm.send(message, function (err, response) {
          if (err) {
               console.log('sendIosPush fail');
               if (cb) {
                    return cb(err);
               }
          } else {
               console.log('sendIosPush done');
               if (cb) {
                    return cb(null);
               }
          }
     });
};

exports.sendAndroidPush = function (fcmToken, message, cb) {
     var message = {
          to: fcmToken,
          data: {
               title: message.title,
               content: message.text,
               imgUrl: message.imgUrl,
               entityId: message.entityId,
               entityName: message.entityName,
               dataId: message.dataId,
               dataName: message.dataName,
               sound: 'default'
          },
          android: {
               priority: 'high',
          },
          priority: 'high',
     };
     fcm.send(message, function (err, response) {
          if (err) {
               console.log('sendAndroidPush fail');
               if (cb) {
                    return cb(err);
               }
          } else {
               console.log('sendAndroidPush done');
               if (cb) {
                    return cb(null);
               }
          }
     });
};

exports.sendMulticast = function (fcmTokens, message, cb) {
     var message = {
          registration_ids: fcmTokens,
          data: {
               title: 'esusu',
               content: message.text,
               imgUrl: message.imgUrl,
          },
     };
     fcm.send(message, function (err, response) {
          if (err) {
               if (cb) {
                    return cb(err);
               }
          } else {
               if (cb) {
                    return cb(null);
               }
          }
     });
};
