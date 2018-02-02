module.exports = function (request, response, next) {

	if (request.isAuthenticated()) {
		request.app.locals.user = request.user
		return next()
	}
	else {
		response.render('login', {
			info: "You must be logged in to view " + request.originalUrl,
			attemptedUrl: request.originalUrl
		})		
	}
}