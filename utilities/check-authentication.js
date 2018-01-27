function checkAuthentication(request, response, next) {
	if (request.isAuthenticated()) return next()
	response.send('Recaptcha denial')
}

module.exports = checkAuthentication