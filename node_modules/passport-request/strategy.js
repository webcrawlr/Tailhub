var util     = require('util');
var Strategy = require('passport-strategy');

function RequestStrategy(options, verify) {
  if (typeof options == 'function') {
    verify  = options;
    options = {};
  }
  if (! verify) {
    throw new TypeError('RequestStrategy requires a verify callback');
  }
  Strategy.call(this);
  this.name    = 'request';
  this._verify = verify;
}

util.inherits(RequestStrategy, Strategy);

RequestStrategy.prototype.authenticate = function(req, options) {
  var self = this;
  this._verify(req, function(err, user, info) {
    if (err)    { return self.error(err); }
    if (! user) { return self.fail(info); }
    self.success(user, info);
  });
};

module.exports.Strategy = RequestStrategy;
