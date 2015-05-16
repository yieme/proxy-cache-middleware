'use strict';
var express         = require('express')
var app             = express()
var port            = process.env.PORT || 3000
var proxyMiddleware = require('./')

function logMiddleware(req, res, next) {
	console.log(req.url)
	next()
}

app.use(logMiddleware)


app.get('/', function(req, res) {
	var urls     = '/1140/2.0/1140.min.css'
	var template = '<body style="font-family:arial;padding-top:50px"><center>Example: <a href="$url">$url</a>'
	var page     = template.replace('$url', urls).replace('$url', urls)
  res.send(page)
})

app.use(proxyMiddleware)


app.listen(port)
console.log('listening on', port)
