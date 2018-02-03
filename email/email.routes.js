const express = require('express')
const router = express.Router()
const checkRecaptcha = require('../utilities/check-recaptcha')
const log = require('winston')
const transporter = require('./transporter')

router.post('/contact', checkRecaptcha, (request, response)=> {

	let mailOptions = {
		from: `"${request.body['name']}" <${request.body['email']}>`,
		to: 'admin@oobfest.com',
		subject: "CONTACT FORM | " + request.body['subject'],
		text: `From: ${request.body['name']}, ${request.body['email']} \n${request.body['message']}`
	}

	log.info("Attempting to send email from contact form...")
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
	
})

module.exports = router