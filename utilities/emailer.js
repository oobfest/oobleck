const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')

router.post('/contact', (request, response)=> {

	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	nodemailer.createTestAccount((err, account) => {

		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			host: 'smtp.ethereal.email',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: account.user, // generated ethereal user
				pass: account.pass  // generated ethereal password
			}
		})

		// setup email data with unicode symbols
		let mailOptions = {
			from: '"Fred Foo 👻" <foo@blurdybloop.com>',
			to: 'sld.potato@gmail.com, baz@blurdybloop.com',
			subject: 'Hello ✔',
			text: 'Hello world?',
			html: '<b>Hello world?</b>'
		}

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) return console.log(error)

		console.log('Message sent: %s', info.messageId);
		// Preview only available when sending through an Ethereal account
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
		// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
		})

		res.end('Yay!')
	})
})

module.exports = router