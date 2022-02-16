'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { localeErrors } = require('../helpers/error');

module.exports.configure = (app) => {
     app.use(function (err, req, res, next) {
          if (err) {
               // @ts-ignore
               (res.log || log).error(err.stack);
               if (req.xhr) {
                    res.send(500, { error: 'Something went wrong!' });
               } else {
                    next(err);
               }

               return;
          }
          res.header('Access-Control-Allow-Origin', '*');
          res.header(
               'Access-Control-Allow-Methods',
               'POST, GET, OPTIONS, PUT, DELETE'
          );
          res.header(
               'Access-Control-Allow-Headers',
               'Origin, X-Requested-With, Content-Type, Accept, Authorization'
          );
          next();
     });

     // app.use(require('morgan')("combined",{ "stream": logger.stream }));
     // @ts-ignore
     app.use(express.json({ limit: '50mb', keepExtensions: true }));
     app.use(
          express.urlencoded({
               extended: true,
          })
     );

     app.set('view engine', 'pug');
     const root = path.normalize(__dirname + './../');
     app.set('views', path.join(root, 'views'));
     app.use(express.static(path.join(root, 'public')));
     app.use(localeErrors);
};
