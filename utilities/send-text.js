const twilio = require('twilio')

module.exports = function(message, callback) {

	let sid = process.env.TWILIO_SID
	let token = process.env.TWILIO_TOKEN
	let recipient = process.env.TWILIO_RECIPIENT
	let twilioClient = new twilio(sid, token)

	twilioClient.messages
		.create({ body: message, to: recipient, from: '+15122714857' })
		.then((message)=> { callback(message) })
}