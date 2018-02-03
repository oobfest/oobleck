const log = require('winston')

module.exports = async function(app) {

	// Dependencies
	const cookieParser = require('cookie-parser')

	// Setup
	app.use(cookieParser())

	// Log
	log.info("✅ Cookie Parser")
}