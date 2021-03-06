const log = require('winston')

module.exports = async function(app) {

	// Dependencies
	const passport = require('passport')
	let localStrategy = require('passport-local')
	let user = require('../users/schema')

	// Setup
	app.use(passport.initialize())
	app.use(passport.session())
	passport.use(new localStrategy(user.authenticate()))
	passport.serializeUser(user.serializeUser())
	passport.deserializeUser(user.deserializeUser())

	// Log
	log.info("✅  Passport")
}