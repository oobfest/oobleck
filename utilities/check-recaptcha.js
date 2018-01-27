const httpRequest = require('request')

function checkRecaptcha(request, response, next) {

	console.log("Checking recaptcha", request.body['g-recaptcha-response'])

	let recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY
	let gRecaptchaResponse = request.body['g-recaptcha-response']

	httpRequest.post('https://www.google.com/recaptcha/api/siteverify', { 
			form: { secret: recaptchaSecretKey, response: gRecaptchaResponse },
			json: true 
		},
		function(error, httpResponse, body) {
			console.log("Requested")
			if(body.success) {
				next()
			}
			else {
				console.log("No bueno", error)
				response.render('error', {error: new Error("Recaptcha failed")})
			}
		})
}

module.exports = checkRecaptcha