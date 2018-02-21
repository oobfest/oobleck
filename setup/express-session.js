const log = require('winston')

module.exports = async function(app) {

	// Setup
	app.use(require('cookie-session')({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false
	}))

	// Log
	log.info("✅  Express Session")
}