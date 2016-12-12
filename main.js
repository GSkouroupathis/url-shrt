var express = require('express')
var app = express()
var path = require('path')
var MongoClient = require('mongodb').MongoClient
var config = require('./config')

// App setup
app.set('views', './views')
app.set('view engine', 'pug')

app.use('./static', express.static(path.join(__dirname, 'public')))

// Handlers
app.get('/', function(req, res) {
	res.render('index', {'title':'Title', 'message':'Hello'})
})

app.get('/:linkID([a-zA-Z0-9]+)', function(req, res) {
	var dbConnectURL = 'mongodb://localhost:'+config.db.port+'/'+config.db.name;
	MongoClient.connect(dbConnectURL, function (err, db) {
	  if (err) throw err

	  db.collection(config.db.collection).find({'_id':req.params.linkID}).toArray(function (err, result) {
	    if (err) throw err

			if (result.length != 0) {
				var link = result[0].link;
				res.status(301);
				res.location(link);
				res.end();
			} else {
				console.log('nop');
			}
	  })
	})
})

// Start server
var server = app.listen(3020, function() {
	console.log('Running on port ' + server.address().port)
})
