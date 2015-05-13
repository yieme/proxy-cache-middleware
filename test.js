'use strict';
var fs             = require('fs')
var express        = require('express')
var app            = express()
var port           = process.env.PORT  || 3000
var proxyMiddleware = require('./index')({
	target:   process.env.TARGET         || "https://cdnjs.cloudflare.com/ajax/libs",
	control:  process.env.CACHE_CONTROL  || 0, // 30672000 // 0 = disable cache-control header
	duration: process.env.CACHE_DURATION || 1, // 30672000 // 0 = disable file caching
	dir:      process.env.CACHE_DIR      || './tmp'
})

function logMiddleware(req, res, next) {
	console.log(req.url)
	next()
}


//app.use(logMiddleware)
app.get('/', function(req, res) {
  res.send('hello world')
})
app.use(proxyMiddleware)


app.listen(port)
console.log('listening on', port)
