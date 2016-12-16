var config = {};

config.db = {};
config.db.port = 27017;
config.db.name = 'mydb';
config.db.collection = 'links';

config.cleanup = {};
config.cleanup.timeoutMillis = 1000 * 60 * 60 * 24;
module.exports = config;
