const httpRequest = require('request')

function checkRecaptcha(request, response, next) {
	let recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY
	let gRecaptchaResponse = request.body['g-recaptcha-response']
	httpRequest.post('https://www.google.com/recaptcha/api/siteverify', { 
			form: { secret: recaptchaSecretKey, response: gRecaptchaResponse },
			json: true 
		},
		function(error, httpResponse, body) {
			if(body.success) next()
			else response.render('error', {error: {status: '', message: "Recaptcha failed"}})
		})
}

module.exports = checkRecaptcha