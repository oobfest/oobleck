module.exports = async function(app) {

	// Dependencies
	const log = require('winston')
	const express = require('express')
	const router = express.Router()

	// Setup
	app.use('/', 			require('../users/index.routes'))
	app.use('/', 			require('../utilities/emailer'))
	app.use('/apply', 		require('../submissions/apply.routes'))
	app.use('/submissions', require('../submissions/submission.routes'))
	app.use('/users', 		require('../users/user.routes'))

	// 404 Error Page
	app.use((request, response, next)=> {
		let error = new Error("Not found")
		error.status = 404
		next(error)
	})

	// General Error Page
	app.use((error, request, response, next)=> {
		response.status(error.status || 500)
		// In production, we won't output a stack trace from {error: error}
		log.error("Errorrrrr :(", error)
		response.render('error', { error: error })
	})

	// Home Page (show login page)
	router.get('/', (request, response) => {
		response.render('login')
	})	

	log.info("✅  Routes")
}