var pg = require('pg');

require("dotenv").config();

var conString = process.env['SQL_LINK'];
var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
});

module.exports = client;