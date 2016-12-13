var	express = require('express')
		app = express()
		path = require('path')
		MongoClient = require('mongodb').MongoClient
		bodyParser = require('body-parser')
		datejs = require('datejs')
		utils = require('./utils')
		config = require('./config')

var db

// Helper functions
var sendError = function(errorMsg, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(
		JSON.stringify({ 'success': 'false' , 'url': 'none', 'error': errorMsg}));
}

/*FIXME*/
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

// App setup
app.set('views', './views')
app.set('view engine', 'pug')

app.use('./static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Handlers
app.get('/', function(req, res) {
	res.render('index', {'title':'Title', 'message':'Hello'})
})

app.post('/url', function(req, res) {
	var	url			= req.body.url,
			days		=	req.body.days,
			hours		= req.body.hours,
			minutes	= req.body.minutes;

	if (!url || !url.length)
		sendError('Please provide a URL', res);

	if (!days || !hours || !minutes)
		sendError('Trying to hack the Gibson?', res);

	if (isNaN(days) || isNaN(hours) || isNaN(minutes))
		sendError('Days, hours and minutes must be numeric values', res);

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

	db.collection(config.db.collection).insertOne(
		{'_id':/*FIXME*/makeid(),/*FIXME*/'link':url,'expiry_date_utc':expirationDate},
		function(err, result) {
			if (err) throw err
		}
	)
	res.sendStatus(200)
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
				console.log('nop');
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
