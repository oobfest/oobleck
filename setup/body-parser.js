const log = require('winston')

module.exports = async function(app) {
	
	// Dependencies
	const bodyParser = require('body-parser')

	// Setup
	app.use(bodyParser.urlencoded({extended: true}))
	app.use(bodyParser.json())

	// Log
	log.info("✅  Body Parser")
}