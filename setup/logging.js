function setupLogging(app) {
	const morgan = require('morgan')
	const chalk = require('chalk')

	app.use(morgan(function (tokens, request, response) {
		let statusCode = tokens.status(request, response)
		let method = tokens.method(request, response)
		let url = tokens.url(request, response)
		let colorize = statusCode > 400 ? chalk.red : chalk.white

		return colorize([
			tokens.status(request, response),
			tokens.method(request, response),
			tokens.url(request, response),
		].join(' '))
	}))	
}

module.exports = setupLogging