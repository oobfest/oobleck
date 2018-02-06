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

	// Home Page (Login screen)
	app.use(router.get('/', (request, response) => {
		// Todo: Checks that user is signed in, goes to page apropriate for role
		response.render('login')
	}))

	// Catch-all, creates 404 error
	app.use((request, response, next)=> {
		let error = new Error("Not found")
		//error.status = 404
		next(error)
	})

	// Error page!
	app.use((error, request, response, next)=> {
		// response.status(error.status || 500)
		// In production, we won't output a stack trace from {error: error}
		// log.error("Errorrrrr :(", error)
		response.render('error', { error: error })
		next(error)
	})

	log.info("✅  Routes")
}