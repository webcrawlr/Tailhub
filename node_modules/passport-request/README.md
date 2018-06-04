# passport-request

[Passport](http://passportjs.org/) strategy for authenticating against
Express' [`request`](http://expressjs.com/en/4x/api.html#req) object.

## Install

```bash
$ npm install passport-request
```

## Usage

#### Configure Strategy

The strategy requires a `verify` callback, which gets passed the request object and a `done` callback that should be called with the results of the authentication.

For example, to allow authentication using `POST /login/:username` and a `password` parameter in the request body:

```js
var RequestStrategy = require('passport-request').Strategy;

passport.use(new RequestStrategy(function(req, done) {
  var username = req.params.username;
  var password = req.body.password;
  User.findOne({ username : username }, function (err, user) {
    if (err) {
      return done(err);
    } else if (! user) {
      return done(null, false);
    } else if (! user.verifyPassword(password)) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  });
));
```
#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'request'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.post('/login/:username',
  passport.authenticate('request', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);
```

## Credits

- [Robert Klep](http://github.com/robertklep)
- [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)
