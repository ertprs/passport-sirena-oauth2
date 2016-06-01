'use strict';

/**
 * Global Modules
 */
var OAuth2Strategy = require('passport-oauth2'),
	util = require('util'),
	InternalOAuthError = require('passport-oauth2').InternalOAuthError,
	AuthorizationServerAPIError = require('./errors/authorizationServerAPIError'),
	UserInfoError = require('./errors/userInfoError');

/**
 * `Strategy` constructor.
 *
 * This authentication strategy authenticates requests by delegating to
 * the Sirena Authorization Server using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your application's client id
 *   - `clientSecret`  your application's client secret
 *   - `callbackURL`   URL to which the Authorization Server will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new SirenaStrategy({
 *         authorizationURL: https://accounts.***.com/oauth2/authorize
 *         tokenURL: https://accounts.***.com/oauth2/token
 *         clientID: 'dashboard',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.appname.net/auth/sirena/callback'
 *         userProfileURL: 'https://www.appname.net/oauth2/profile'
 *       },
 *       function(accessToken, refreshToken, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy(options, verify) {
	options = options || {};

	OAuth2Strategy.call(this, options, verify);
	this.name = 'sirena';
	this._userProfileURL = options.userProfileURL;
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from the authorization server.
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
	var self = this;
	this._oauth2.get(this._userProfileURL, accessToken, function(err, body, res) {

		var json;

		if (err) {
			if (err.data) {
				try {
					json = JSON.parse(err.data);
				} catch (_) {}
			}

			if (json && json.error && json.error.message) {
				return done(new Error(json.error.message, json.error.code));
			} else if (json && json.error && json.error_description) {
				return done(new UserInfoError(json.error_description, json.error));
			}
			return done(new InternalOAuthError('Failed to fetch user profile', err));
		}

		try {
			json = JSON.parse(body);
		} catch (ex) {
			return done(new Error('Failed to parse user profile'));
		}

		var profile = JSON.parse(json);

		done(null, profile);
	});
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
