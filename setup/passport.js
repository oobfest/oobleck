const log = require('winston')

function setupPassport(app) {
	const passport = require('passport')
	let localStrategy = require('passport-local')
	app.use(passport.initialize())
	app.use(passport.session())

	let user = require('../users/user.schema')
	passport.use(new localStrategy(user.authenticate()))
	passport.serializeUser(user.serializeUser())
	passport.deserializeUser(user.deserializeUser())

	log.info("Passport ✅")
}

module.exports = setupPassport