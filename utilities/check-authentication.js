function checkAuthentication(request, response, next) {
	if (request.isAuthenticated()) return next()
	else response.send('Recaptcha denial')
}

module.exports = checkAuthentication