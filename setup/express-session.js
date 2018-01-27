// Todo: Express Session not fully implemented
// Not ready for production
const log = require('winston')

function setupExpressSession(app) {
	app.use(require('express-session')({
		secret: 'Donnie Darko is an overrated movie',
		resave: false,
		saveUninitialized: false
	}))

	log.info("Express Session 🆗")
}

module.exports = setupExpressSession