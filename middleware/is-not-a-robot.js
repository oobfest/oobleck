const httpRequest = require('request')

module.exports = function(request, response, next) {

	if(process.env.NODE_ENV != 'production') next()

	let recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY
	let gRecaptchaResponse = request.body['g-recaptcha-response']

	httpRequest.post('https://www.google.com/recaptcha/api/siteverify', { 
			form: { secret: recaptchaSecretKey, response: gRecaptchaResponse },
			json: true 
		},
		function(error, httpResponse, body) {
			if(error) response.render('error', {error: error})
			if(body.success) next()
			else response.render('error', {error: new Error("Recaptcha failed. Click \"back\" and try again!")})
		})
}