var express = require('express')
var app = express()
var path = require('path')
var config = require('./config')

// App setup
app.set('views', './views')
app.set('view engine', 'pug')

app.use('./static', express.static(path.join(__dirname, 'public')))

// Handlers
app.get('/', function(req, res) {
	res.render('index', {'title':'Title', 'message':'Hello'})
})

// Start server
var server = app.listen(3020, function() {
	console.log('Running on port ' + server.address().port)
})
