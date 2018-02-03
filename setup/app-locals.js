const log = require('winston')

module.exports = async function(app) {
	
	// Dependencies
	const base64 = require('../utilities/base64')

	// Setup
	app.locals.base64 = base64

	// Log
	log.info("✅  App Locals")
}