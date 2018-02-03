const log = require('winston')

module.exports = function (request, response, next) {
	log.verbose("Checking user authentication")
	if (request.isAuthenticated()) {
		log.verbose("User passed authentication")
		request.app.locals.user = request.user
		return next()
	}
	else {
		log.verbose("User authentication failed")
		response.render('login', {
			info: "You must be logged in to view " + request.originalUrl,
			attemptedUrl: request.originalUrl
		})		
	}
}