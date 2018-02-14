const log = require('winston')

module.exports = async function(app) {

	// Dependencies
	const express = require('express')
	const router = express.Router()

	// Setup
	app.use('/', 			require('../users/login.routes'))
	app.use('/', 			require('../email/email.routes'))
	app.use('/apply', 		require('../submissions/apply.routes'))
	app.use('/submissions', require('../submissions/submission.routes'))
	app.use('/users', 		require('../users/user.routes'))
	app.use('/hosts',		require('../hosts/host.routes'))

	// Home Page (Login screen)
	app.use(router.get('/', (request, response) => {
		// Force HTTPS if we're running in production
		if(process.env.NODE_ENV == 'production' && request.headers['x-forwarded-proto'] != 'https') {
			response.redirect('https://' + request.hostname + request.url)
		}
		else {
			response.render('login')
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