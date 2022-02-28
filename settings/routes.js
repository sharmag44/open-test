'use strict';
const apiRoutes = require('../helpers/apiRoute');
var auth = require('../middlewares/authorization');

module.exports.configure = (app) => {
     app.get('/', (req, res) => {
          res.render('index', {
               title: 'Rajveer Chahl',
          });
     });
     app.get('/api', (req, res) => {
          res.render('index', {
               title: 'Rajveer Chahl',
          });
     });

     let api = apiRoutes(app);
     api.model('images').register([
          {
               action: 'POST',
               method: 'upload',
               url: '/upload',
               filter: auth.requiresTokenOptional,
          },
     ]);
     api.model('users').register([
          {
               action: 'POST',
               method: 'signUp',
               url: '/signup',
          },
          {
               action: 'POST',
               method: 'signIn',
               url: '/signin',
               filter: auth.requiresTokenOptional,
          },
          {
               action: 'POST',
               method: 'verification',
               url: '/verify',
          },
          {
               action: 'POST',
               method: 'forgotPassword',
               url: '/forgotPassword',
               filter: auth.requiresTokenOptional,
          },
          {
               action: 'PUT',
               method: 'updatePassword',
               url: '/updatePassword/:id',
               filter: auth.requiresTokenOptional,
          },
          {
               action: 'PUT',
               method: 'update',
               url: '/:id',
               filter: auth.requiresToken,
          },
          {
               action: 'GET',
               method: 'get',
               url: '/:id',
               filter: auth.requiresToken,
          },
          {
               action: 'GET',
               method: 'search',
               filter: auth.requiresToken,
          },
          {
               action: 'DELETE',
               method: 'delete',
               url: '/:id',
               filter: auth.requiresToken,
          },
          {
               action: 'POST',
               method: 'resendForgot',
               url: '/new/resend',
               filter: auth.requiresTokenOptional,
          },
          {
               action: 'POST',
               method: 'resend',
               url: '/resend',
               filter: auth.requiresTokenOptional,
          },
          {
               action: 'GET',
               method: 'checkValidEmail',
               url: '/check/email',
               filter: auth.requiresTokenOptional,
          },
          {
               action: 'GET',
               method: 'checkUserWithFacebook',
               url: '/get/facebookId',
               filter: auth.requiresTokenOptional,
          },
          {
               action: 'GET',
               method: 'checkUserWithGoogle',
               url: '/get/googleId',
               filter: auth.requiresTokenOptional,
          },
     ]);

     api.model('properties').register([
          {
               action: 'POST',
               method: 'likeDislike',
               url: '/like/dislike',
               filter: auth.requiresToken,
          },
          {
               action: 'POST',
               method: 'create',
               filter: auth.requiresToken,
          },
          {
               action: 'PUT',
               method: 'update',
               url: '/:id',
               filter: auth.requiresToken,
          },
          {
               action: 'GET',
               method: 'get',
               url: '/:id',
               filter: auth.requiresToken,
          },
          {
               action: 'GET',
               method: 'search',
               filter: auth.requiresToken,
          },
          {
               action: 'DELETE',
               method: 'delete',
               url: '/:id',
               filter: auth.requiresToken,
          },
     ]);

     api.model('chats').register([
          {
               action: 'POST',
               method: 'create',
               filter: auth.requiresToken,
          },
          {
               action: 'GET',
               method: 'get',
               url: '/:id',
               filter: auth.requiresToken,
          },
          {
               action: 'GET',
               method: 'search',
               filter: auth.requiresToken,
          },
          {
               action: 'PUT',
               method: 'update',
               url: '/:id',
               filter: auth.requiresToken,
          },
          {
               action: 'DELETE',
               method: 'delete',
               url: '/:id',
               filter: auth.requiresToken,
          },
          {
               action: 'PUT',
               method: 'updateLastMessage',
               url: '/last/message/:id',
               filter: auth.requiresToken,
          },
          {
               action: 'GET',
               method: 'totalUnreadChatCount',
               url: '/unread/chats',
               filter: auth.requiresToken,
          },
     ]);

     api.model('schedules').register([
          {
               action: 'GET',
               method: 'getScheduleList',
               url: '/get/slots',
               filter: auth.requiresToken,
          },
          {
               action: 'POST',
               method: 'create',
               filter: auth.requiresToken,
          },
          {
               action: 'PUT',
               method: 'update',
               url: '/:id',
               filter: auth.requiresToken,
          },
          {
               action: 'GET',
               method: 'get',
               url: '/:id',
               filter: auth.requiresToken,
          },
          {
               action: 'GET',
               method: 'search',
               filter: auth.requiresToken,
          },
          {
               action: 'DELETE',
               method: 'delete',
               url: '/:id',
               filter: auth.requiresToken,
          },
     ]);

     api.model('vehicles').register([
          {
               action: 'POST',
               method: 'create',
               filter: auth.requiresToken,
          },
          {
               action: 'PUT',
               method: 'update',
               url: '/:id',
               filter: auth.requiresToken,
          },
          {
               action: 'GET',
               method: 'get',
               url: '/:id',
               filter: auth.requiresToken,
          },
          {
               action: 'GET',
               method: 'search',
               filter: auth.requiresToken,
          },
          {
               action: 'DELETE',
               method: 'delete',
               url: '/:id',
               filter: auth.requiresToken,
          },
     ]);
};
