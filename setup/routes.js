const log = require('winston')

function setupRouter(app) {
	const express = require('express')
	const router = express.Router()

	const indexRouter = require('../users/index.routes')
	const applyRoutes = require('../submissions/apply.routes')
	const submissionRoutes = require('../submissions/submission.routes')
	const userRoutes = require('../users/user.routes')
	const imgurRoutes = require('../imgur/imgur.routes')
	const emailerRoutes = require('../utilities/emailer')

	app.use('/', indexRouter)
	app.use('/', emailerRoutes)
	app.use('/apply', applyRoutes)
	app.use('/submissions', submissionRoutes)
	app.use('/users', userRoutes)
	app.use('/imgur', imgurRoutes)	

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

	log.info("Router ✅")
}

module.exports = setupRouter