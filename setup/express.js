const log = require('winston')
function setupExpress(app) {
	app.set('view engine', 'pug')		// Pug!
	log.info("Express ✅")
}

module.exports = setupExpress