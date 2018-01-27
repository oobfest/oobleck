const log = require('winston')

function setupBodyParser(app) {
	const bodyParser = require('body-parser')
	app.use(bodyParser.urlencoded({extended: true}))
	app.use(bodyParser.json())
	log.info("Body Parser ✅")
}

module.exports = setupBodyParser