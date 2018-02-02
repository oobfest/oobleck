module.exports = async function(app) {

	// Dependencies
	const log = require('winston')

	// Setup
	app.use(require('express-session')({
		secret: 'Donnie Darko is an overrated movie',
		resave: false,
		saveUninitialized: false
	}))

	// Log
	log.info("🆗  Express Session")
}