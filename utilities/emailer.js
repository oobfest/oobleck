const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const checkAuthentication = require('../utilities/check-authentication')

router.post('/contact', (request, response)=> {

	console.log("BODY!", request.body)

	let transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'no-reply@oobfest.com',
			pass: process.env.NO_REPLY_PASSWORD
		}
	})

	let mailOptions = {
		from: `"${request.body['name']}" <${request.body['email']}>`,
		to: 'admin@oobfest.com',
		subject: "CONTACT FORM | " + request.body['subject'],
		text: `From: ${request.body['name']}, ${request.body['email']} \n ${request.body['message']}`
	}

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			response.send(error)
		}
		else {
			console.log("Email sent", info)
			response.send("Yay")
		} 
	})

})

module.exports = router