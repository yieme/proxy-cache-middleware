var should = require('chai').should(),
    proxyCacheMiddleware = require('..')
;

describe('proxy-cache-middleware', function() {
  var expected = ["hello", "world"]
  var expectedString = JSON.stringify(expected)
  it('should eaual ' + expectedString, function(done) {
    var test = proxyCacheMiddleware()
    var json = JSON.stringify(test)
    json.should.equal(expectedString);
    done();
  });
});
