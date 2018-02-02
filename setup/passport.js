
module.exports = async function(app) {

	// Dependencies
	const log = require('winston')
	const passport = require('passport')
	let localStrategy = require('passport-local')
	let user = require('../users/user.schema')

	// Setup
	app.use(passport.initialize())
	app.use(passport.session())
	passport.use(new localStrategy(user.authenticate()))
	passport.serializeUser(user.serializeUser())
	passport.deserializeUser(user.deserializeUser())

	// Log
	log.info("✅  Passport")
}