const log = require('winston')

function setupRouter(app) {

	const indexRouter = require('../routes/index')
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

	// Error handling route
	app.use((request, response, next)=> {
		let error = new Error("Not found")
		error.status = 404
		next(error)
	})

	app.use((error, request, response, next)=> {
		response.status(error.status || 500)
		// In production, we won't output a stack trace from {error: error}
		console.log(error)
		response.render('error', { error: error })
	})

	log.info("Router ✅")
}

module.exports = setupRouter