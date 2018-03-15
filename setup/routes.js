const log = require('winston')

module.exports = async function(app) {

	// Dependencies
	const express = require('express')
	const router = express.Router()

	// Setup
	app.use('/api/hosts',	require('../hosts/api.routes'))
	app.use('/hosts',		require('../hosts/view.routes'))

	app.use('/', 			require('../login/routes'))
	app.use('/', 			require('../email/routes'))
	app.use('/apply', 		require('../apply/routes'))
	app.use('/submissions', require('../submissions/routes'))
	app.use('/users', 		require('../users/routes'))
	

	// Home Page (Login screen)
	app.use(router.get('/', (request, response) => {

		// If we're in production, use HTTPS 
		let isProductionEnvironment = (process.env.NODE_ENV == 'production')
		let isHttps = (request.headers['x-forwarded-proto'] == 'https')
		if (isProductionEnvironment && !isHttps) {
			response.redirect('https://' + request.hostname + request.url)
		}
		else {
			response.render('login')
		}
	}))

	// Catch-all, creates 404 error
	app.use((request, response, next)=> {
		let error = new Error("Not found")
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