const log = require('winston')

function setupCookieParser(app) {
	const cookieParser = require('cookie-parser')
	app.use(cookieParser())
	log.info("Cookie Parser ✅")
}

module.exports = setupCookieParser