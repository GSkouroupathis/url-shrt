config = require('./config')

cleanUp = {

	start: function(db, timeoutMillis) {
		setInterval(function() {
			var now = new Date();
			var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
			db.collection(config.db.collection).deleteMany(
				{
					'expiry_date_utc': {'$lt': now_utc}
				},
				function(err, result) {
					if (err) console.error(err)
				});
		}, timeoutMillis);
	}

}

module.exports = cleanUp;
