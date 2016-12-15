var	express = require('express')
		app = express()
		path = require('path')
		MongoClient = require('mongodb').MongoClient
		bodyParser = require('body-parser')
		datejs = require('datejs')
		favicon = require('serve-favicon')
		utils = require('./utils')
		config = require('./config')

var db

// Helper functions
var sendMessage = function(status, message, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(
		JSON.stringify({'status': status, 'message': message}));
}

var sendSuccess = function(message, res) {
	sendMessage('success', message, res)
}

var sendError = function(errorMsg, res) {
	sendMessage('error', errorMsg, res)
}

var saveURLtoDB = function(id, url, expirationDate) {
	db.collection(config.db.collection).insertOne(
		{'_id':id,/*FIXME*/'link':url,'expiry_date_utc':expirationDate},
		function(err, result) {
			if (err) throw err
		}
	)
}

function getNextID(url, expirationDate, callback1, res, callback2) {
	var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

	db.collection(config.db.collection).find().limit(1).sort({$natural:-1}).toArray(function (err, result) {
		if (err) throw err
		if (result.length == 1) {
			var currentID = result[0]._id
			var nextID = utils.toRadix(utils.fromRadix(currentID, alphabet) + 1, alphabet)
		} else {
			nextID = alphabet[0]
		}
		callback1(nextID, url, expirationDate)
		callback2(nextID.toString(), res)
	})
}

// App setup
app.set('views', './views')
app.set('view engine', 'ejs')

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Handlers
var renderIndex = function(req, res) {
	res.render('index')
}

app.get('/', function(req, res) {
	//res.render('index')
	renderIndex(req, res)
})

app.post('/url', function(req, res) {
	var	url			= req.body.url,
			days		=	req.body.days,
			hours		= req.body.hours,
			minutes	= req.body.minutes;

	if (!url || !url.length) {
		sendError('Please provide a URL', res);
		return;
	}

	if (!days || !hours || !minutes) {
		sendError('Trying to hack the Gibson?', res);
		return;
	}

	if (days < 0 || days > 100 || hours < 0 || hours > 100
		|| minutes < 0 || minutes > 100) {
		sendError('Values must be between 0 and 100', res);
		return;
	}

	if (isNaN(days) || isNaN(hours) || isNaN(minutes)) {
		sendError('Days, hours and minutes must be numeric values', res);
		return;
	}

	if (!utils.urlHasScheme(url)) {
		url = '//' + url;
	}

	days = parseInt(days);
	hours = parseInt(hours);
	minutes = parseInt(minutes);

	var today = new Date();
	if (days == 0 && hours == 0 && minutes == 0) {
		var expirationDate = today.add(365 * 100).days();
	} else {
		var expirationDate = today.add(days).days();
		expirationDate = expirationDate.add(hours).hours();
		expirationDate = expirationDate.add(minutes).minutes();
	}
	var nextID = getNextID (url, expirationDate, saveURLtoDB, res, sendSuccess)
})

app.get('/:linkID([a-zA-Z0-9]+)', function(req, res) {
	  db.collection(config.db.collection).find({'_id':req.params.linkID}).toArray(function (err, result) {
	    if (err) throw err

			if (result.length != 0) {
				var now = new Date();
				var urlExpiryDate = result[0].expiry_date_utc;/*FIXME*/
				if (now.getTime() > urlExpiryDate.getTime()) {
					sendError('The link has expired', res);
				} else {
					var link = result[0].link;
					res.redirect(301, link);
				}
			} else {
				renderIndex(req, res)
			}
	  })
	})

// Start server
var dbConnectURL = 'mongodb://localhost:'+config.db.port+'/'+config.db.name;

MongoClient.connect(dbConnectURL, function (err, database) {
	if (err) throw err
	db = database
	var server = app.listen(3020, function() {
		console.log('Running on port ' + server.address().port)
	})
})
