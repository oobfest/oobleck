module.exports = async function(app) {
	
	// Dependencies
	const log = require('winston')
	const bodyParser = require('body-parser')

	// Setup
	app.use(bodyParser.urlencoded({extended: true}))
	app.use(bodyParser.json())

	// Log
	log.info("✅  Body Parser")
}