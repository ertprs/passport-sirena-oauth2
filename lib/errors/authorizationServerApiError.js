/**
 * `AuthorizationServerAPIError` error.
 * *
 * @constructor
 * @param {string} [message]
 * @param {number} [code]
 * @access public
 */
function AuthorizationServerAPIError(message, code) {
	Error.call(this);
	Error.captureStackTrace(this, arguments.callee);
	this.name = 'AuthorizationServerAPIError';
	this.message = message;
	this.code = code;
}

// Inherit from `Error`.
AuthorizationServerAPIError.prototype.__proto__ = Error.prototype;

// Expose constructor.
module.exports = AuthorizationServerAPIError;
