module.exports = async function(app) {

	// Dependencies
	const log = require('winston')
	
	// Setup
	// Pug: the official view engine of OoBleck
	app.set('view engine', 'pug')

	// Log
	log.info("✅  Express")
}