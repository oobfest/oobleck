function authenticateUser(request, response, next) {

	if (request.isAuthenticated()) return next()
	response.render('login', {
		info: "You must be logged in to view " + request.originalUrl,
		attemptedUrl: request.originalUrl
	})
}

module.exports = authenticateUser