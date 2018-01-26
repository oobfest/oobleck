function checkAuthentication(request, response, next) {
	if (request.isAuthenticated()) return next()
	response.send('GTFO')
}

module.exports = checkAuthentication