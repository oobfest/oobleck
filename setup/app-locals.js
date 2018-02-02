module.exports = async function(app) {
	
	// Dependencies
	const log = require('winston')
	const base64 = require('../utilities/base64')

	// Setup
	app.locals.base64 = base64

	// Log
	log.info("✅  App Locals")
}