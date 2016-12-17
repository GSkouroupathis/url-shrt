var config = {};

config.db = {};
config.db.host = 'mongodb';
config.db.port = 27017;
config.db.name = 'links-db';
config.db.collection = 'links';

config.cleanup = {};
config.cleanup.timeoutMillis = 1000 * 60 * 60 * 24;

module.exports = config;
