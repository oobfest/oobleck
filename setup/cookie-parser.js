module.exports = async function(app) {

	// Dependencies
	const log = require('winston')
	const cookieParser = require('cookie-parser')

	// Setup
	app.use(cookieParser())

	// Log
	log.info("✅ Cookie Parser")
}