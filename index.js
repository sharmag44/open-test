require('dotenv').config();
const app = require('./app');
var http = require('http');
var config = require('config').get('webServer');

try {
     // @ts-ignore
     require('./settings/database').configure(app);
} catch (err) {
     console.log(err);
}

var server = http.createServer(app);

server.listen(config.port, function () {
     console.log('listening on port:' + config.port);
});
