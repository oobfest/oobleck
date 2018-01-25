function checkAuthentication(request, response, next) {
	// Is Authorizec
	if (request.isAuthenticated()) return next()
	// Is not authorized
	response.send('GTFO')
}

module.exports = checkAuthentication