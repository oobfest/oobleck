const log = require('winston')

module.exports = async function(app) {

	// Setup
	// Pug: the official view engine of OoBleck
	app.set('view engine', 'pug')

	// Log
	log.info("✅  Express")
}