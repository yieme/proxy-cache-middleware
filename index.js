/** Proxy cache middleware for Express
 *
 *  @copyright  Copyright (C) 2015 by Yieme
 *  @module     proxy-cache-middleware
 */
 (function() {
  'use strict';
  function ProxyCacheMiddlewareError(message) { // ref: https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript
    /*jshint validthis: true */
    this.constructor.prototype.__proto__ = Error.prototype
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.message = message
  }

  /** Proxy cache middleware
   *  @class
   *  @param      {object} options - The options
   *  @return     {object}
   */
  function proxyCacheMiddlewareClass(options) {
    /*jshint validthis: true */
    var self = this
    options = options || {}
    self.value = options
    return self
  }



  /** Proxy cache middleware
   *  @constructor
   *  @param      {object} options - The options
   *  @return     {object}
   */
  function proxyCacheMiddleware(options) {
    return new proxyCacheMiddlewareClass(options).value
  }


  module.exports = proxyCacheMiddleware
})();
