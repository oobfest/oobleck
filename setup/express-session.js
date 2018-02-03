const log = require('winston')

module.exports = async function(app) {

	// Setup
	app.use(require('express-session')({
		secret: 'Donnie Darko is an overrated movie',
		resave: false,
		saveUninitialized: false
	}))

	// Log
	log.info("🆗  Express Session")
}