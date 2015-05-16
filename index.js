/** Proxy Cache Middleware for Express
 *
 *  @copyright  Copyright (C) 2015 by Yieme
 *  @module     proxy-cache-middleware
 */

  'use strict';
  var _              = require('lodash')
  var proxyCacheFile = require('proxy-cache-file')
  var options        = {
    dir:           './tmp',
    cacheControl:  24 * 60 * 60 * 1000, // 1 day default
    defaultDomain: 'cdnjs',
    domain: {
      cdnjs:     'https://cdnjs.cloudflare.com/ajax/libs',
      jsdelivr:  'https://cdn.jsdelivr.net',
      google:    'https://ajax.googleapis.com/ajax/libs',
      bootstrap: 'https://maxcdn.bootstrapcdn.com',
    }
}


function proxyCacheMiddleware(req, res, next) {
  if (!res) {
    options = _.extend(options, req)
    return proxyCacheMiddleware
  }

  var target = options.domain[options.defaultDomain]
  var url = target + req.url
  proxyCacheFile({ url: url }, function(err, data) {
    if (err) {
      next(err)
    } else {
      var headers = data.headers
      if (headers.code) {
        res.sendStatus(headers.code)
        res.send(url)
        return
      }
      if (options.cacheControl) res.set('cache-control', 'public, max-age=' + options.cacheControl)
      res.set('content-type', headers.type)
      res.send(data.body)
    }
  })
}



module.exports = proxyCacheMiddleware
