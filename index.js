/** Proxy cache middleware for Express
 *
 *  @copyright  Copyright (C) 2015 by Yieme
 *  @module     proxy-cache-middleware
 */

  'use strict';
  var fs             = require('fs')
  var MD5            = require('MD5')
  var request        = require('request')
  var path           = require('path')
  var forwardHeaders = ['content-type', 'content-encoding']
  var cache
//  var cacheControl   = process.env.CACHE_CONTROL  || 0 // 30672000 // 0 = disable cache-control header
//  var cacheDuration  = process.env.CACHE_DURATION || 0 // 30672000 // 0 = disable file caching
//  var cacheDir       = process.env.CACHE_DIR      || '/tmp'

function proxyCacheMiddleware(req, res, next) {
  if (!res) {
    cache = req
    return proxyCacheMiddleware
  }

  function proxy(url, filePath) {
    request({ method: 'GET', gzip: true, uri: cache.target + url })
    .on('error', function(err) {
      next(err)
    })
    .on('response', function(response) {
      var headers       = response.headers
      var setHeaders    = []
      for (var i=0, len = forwardHeaders.length; i < len; i++) {
        var headerName  = forwardHeaders[i]
        var header      = headers[headerName]
        if (header) {
          res.set(headerName, header)
          setHeaders.push({ name: headerName, value: header })
        }
      }
      if (cache.control) {
        res.set('cache-control', 'public, max-age=' + cache.control)
        setHeaders.push({ name: 'cache-control', value: 'public, max-age=' + cache.control })
      }
      response.on('data', function(data) {
        console.log(url, 'received ' + data.length + ' bytes of compressed data', typeof data)
        res.send(data)
        if (filePath) {
          var writeStream = fs.createWriteStream(filePath)
          writeStream.write(data)
          writeStream.end()
          fs.writeFile(filePath + '.json', JSON.stringify(setHeaders), 'utf8', function(err) {
            if (err) throw new Error(err)
          })
        }
      })
    })
  }

  function fileCache(url, filePath) {
    fs.exists(filePath, function(exists) {
      if (exists) {
        fs.readFile(filePath + '.json', 'utf8', function(err, headers) {
          if (err) throw new Error(err)
          console.log(url, 'from cache')
          headers = JSON.parse(headers)
          for (var i = 0, len = headers.length; i < len; i++) {
            var header = headers[i]
            res.set(header.name, header.value)
          }
          var readStream = fs.createReadStream(filePath)
          readStream.pipe(res)
        })
      } else {
        proxy(url, filePath)
      }
    })
  }

	var url = req.url
	if (url.indexOf('..') < 0) {
    cache        = cache        || {}
    cache.dir    = cache.dir    || '/tmp'
    cache.target = cache.target || 'https://cdnjs.cloudflare.com'
		if (cache.duration) {
      fileCache(url, path.normalize(cache.dir + '/' + MD5(url)))
		} else {
      proxy(url)
    }
	} else {
		next()
	}
}

module.exports = proxyCacheMiddleware
