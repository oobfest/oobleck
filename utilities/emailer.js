const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')

router.post('/contact', (request, response)=> {

	let transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'no-reply@oobfest.com',
			pass: process.env.NO_REPLY_PASSWORD
		}
	})

	let mailOptions = {
		from: '"Website Contact Form" <no-reply@oobfest.com>',
		to: 'admin@oobfest.com',
		subject: request.body['subject'],
		text: request.body['message'],
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