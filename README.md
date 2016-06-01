# passport-sirena-oauth2

[Passport](http://passportjs.org/) strategy for authenticating with Sirena using the OAuth 2.0 API.

This module lets you authenticate using Sirena Accounts in your Node.js applications.
By plugging into Passport, Sirena authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-sirena-oauth2 --save

## Usage

#### Configure Strategy

The Sirena authentication strategy authenticates users using the Sirena account
and OAuth 2.0 tokens.  The client ID and secret obtained given by Sirena creating an
application are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives the access token and optional
refresh token, as well as `profile` which contains the authenticated user's
Sirena profile.  The `verify` callback must call `cb` providing a user to
complete authentication.

    var SirenaStrategy = require('passport-sirena-oauth2').Strategy;

     passport.use(new SirenaStrategy({
         authorizationURL: https://accounts.***.com/oauth2/authorize
         tokenURL: https://accounts.***.com/oauth2/token
         clientID: 'dashboard',
         clientSecret: 'shhh-its-a-secret'
         callbackURL: 'https://www.appname.net/auth/sirena/callback'
         userProfileURL: 'https://www.appname.net/oauth2/profile'
       },
       function(accessToken, refreshToken, profile, cb) {
         User.findOrCreate(..., function (err, user) {
           cb(err, user);
         });
       }
     ));

#### Options

	- `authorizationURL`	URL where the app needs to be authorized
	- `clientID`      		your application's client id
	- `clientSecret`  		your application's client secret
	- `callbackURL`   		URL to which the Authorization Server will redirect the user after granting authorization
	- `tokenURL`			URL where the Authorization Server will return the tokens
	- `userProfileURL`		URL where the strategy can get the profile info


#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'sirena'` strategy, to
authenticate requests.

For example, as route middleware:

    app.get('/auth/sirena',
      passport.authenticate('sirena', { scope: ['profile'] }));

    app.get('/auth/sirena/callback', 
      passport.authenticate('sirena', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });
