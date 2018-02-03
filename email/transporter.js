const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'no-reply@oobfest.com',
		pass: process.env.NO_REPLY_PASSWORD
	}
})
