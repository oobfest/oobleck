let aws = require('aws-sdk')
let nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  SES: new aws.SES({apiVersion: "2010-12-01"}),
  sendingRate: 1
})

let badgeEmail = 
`
<p><b>How do I get my badge?</b><br>
You will be sent specific information on how to pick up your badge closer to the fest, but registration takes place the first few days of the festival at one of our downtown venues.</p>

<p><b>How do I reserve tickets?</b><br>
Once tickets for individual shows go on sale, you'll receive an email letting you know. There will be an "I have a festival badge" option, and you'll register with the email address associated with the badge (AKA, the one this email was sent to) </p>

<p><b>Then what?</b><br>
Just show up with your badge at least 5 minutes before show time! Your name and email will be listed on our box office sheet the day of the show. You'll be required to show us your badge to receive a ticket.</p>

<p><b>What if I'm late?</b><br>
Unfortunately, <i>if you do not show up at least 5 minutes before the show start time we will release your ticket to others on our wait-list.</i> If you plan on driving, please remember to factor in time it will take to park!</p>

<p>Issues with tickets, website or payment? Email box-office@oobfest.com</p>

<p>General thoughts or questions about shows, the festival, etc? Email ruby@oobfest.com</p>
`

module.exports = {
  sendBadgeEmail: function(firstSentence, recipientEmail) {
    transporter.sendMail({
      to: recipientEmail,
      from: "box-office@oobfest.com",
      subject: "Out of Bounds Badge Confirmation",
      html: `<p>${firstSentence}</p> ${badgeEmail}`
    }, (error, info)=> {
      if(error) console.log(error)
      else return
    })
  },
  sendContactEmail: function(senderEmail, senderName, subject, message, callback) {
    transporter.sendMail({
      to: "admin@oobfest.com",
      from: "no-reply@oobfest.com",
      replyTo: senderEmail,
      subject: subject,
      text: message
    }, (error, info)=> {callback(error, info)})
  }
}
