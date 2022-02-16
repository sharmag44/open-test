var express = require('express');
const cors = require('cors');
var app = express();
app.use(cors());
app.use(express.static(__dirname + '/api/uploads'));
app.use('/images',express.static(__dirname + '/images'));

try {
     require('./settings/express').configure(app);
     require('./settings/routes').configure(app);
} catch (err) {
     console.log(err);
}

module.exports = app;
