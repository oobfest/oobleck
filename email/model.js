let aws = require('aws-sdk')
let nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  SES: new aws.SES({apiVersion: "2010-12-01"}),
  sendingRate: 1
})

module.exports = {
  sendContactEmail: function(senderEmail, senderName, subject, message, callback) {
    transporter.sendMail({
      to: "admin@oobfest.com",
      from: senderEmail,
      subject: subject,
      text: message
    }, (error, info)=> {callback(error, info)})
  }
}
