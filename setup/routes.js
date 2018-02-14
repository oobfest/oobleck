const log = require('winston')

module.exports = async function(app) {

	// Dependencies
	const express = require('express')
	const router = express.Router()

	// Setup
	app.use('/', 			require('../login/routes'))
	app.use('/', 			require('../email/routes'))
	app.use('/apply', 		require('../apply/routes'))
	app.use('/submissions', require('../submissions/routes'))
	app.use('/users', 		require('../users/routes'))
	app.use('/hosts',		require('../hosts/routes'))

	// Home Page (Login screen)
	app.use(router.get('/', (request, response) => {

		let isProductionEnvironment = (process.env.NODE_ENV == 'production')
		let isHttps = (request.headers['x-forwarded-proto'] == 'https')
		if (isProductionEnvironment && !isHttps) {
			response.redirect('https://' + request.hostname + request.url)
		}
		else {
			response.redirect('/login')
		}
	}))

	// Catch-all, creates 404 error
	app.use((request, response, next)=> {
		let error = new Error("Not found")
		//error.status = 404
		next(error)
	})

	// Error page!
	app.use((error, request, response, next)=> {
		response.status(error.status || 500)
		log.error("Errorrrrr :(", error)
		response.render('error', { error: error })
	})

	log.info("✅  Routes")
}