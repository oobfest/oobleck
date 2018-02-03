const transporter = require('./transporter')

module.exports = function(recipient, subject, message) {

	let mailOptions = {
		from: 'no-reply@oobfest.com',
		to: recipient,
		subject: subject,
		text: message
	}

	log.info("Attempting to send emailx...")
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			log.error("Failed to send email", error)
			response.send(error)
		}
		else {
			log.info("Email sent!", info)
			response.send(info)
		} 
	})


}