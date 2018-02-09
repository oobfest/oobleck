const log = require('winston')
const transporter = require('./email/transporter')

module.exports = function(recipient, subject, message, callback) {

	let mailOptions = {
		from: 'no-reply@oobfest.com',
		to: recipient,
		subject: subject,
		text: message
	}

	log.info("Attempting to send email...")
	transporter.sendMail(mailOptions, (error, email) => {
		if (error) {
			log.error("Failed to send email", error)
			throw new Error(error)
		}
		else {
			log.info("Email sent!", email)
			callback(email)
		} 
	})


}