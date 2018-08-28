let aws = require('aws-sdk')
let nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  SES: new aws.SES({apiVersion: "2010-12-01"}),
  sendingRate: 1
})

let badgeEmail = 
`
<p>This year's Out of Bounds Comedy Festival is Tues, Aug 28th - Mon, Sept 3rd.</p>

<p><b>How do I reserve tickets?</b><br>
Your badge allows you to reserve tickets online. Simply go to https://oobfest.com/schedule/ and use the email address this email was sent to.</p>

<p><b>How do you get your tickets?</b><br>
Just show up with your badge at least 5 minutes before show time! Your name and email will be listed on our box office sheet the day of the show. You'll be required to show us your badge to receive a ticket.</p>

<p><b>What if I'm late?</b><br>
Unfortunately, <i>if you do not show up at least 5 minutes before the show start time we will release your ticket to others on our wait-list.</i> If you plan on driving, please remember to factor in time it will take to park!</p>

<p><b>How do I get my badge?</b><br>
Please pick up your badge at the following locations:
<ul>
<li>Sunday, 8/26, ColdTowne Theater, 5pm-9pm</li>
<li>Tuesday, 8/28, Hideout Theatre 6:30pm-10pm</li>
<li>Wednesday, 8/29, Hideout Theatre 6:30pm-10pm</li>
<li>Thursday, 8/30, Hideout Theatre 6:30pm-10pm</li>
<li>Friday, 8/31, Hideout Theatre 6:30pm-10pm</li>
<li>Saturday, 9/1 Hideout Theatre 3pm-6pm</li>
</ul></p>

<p><b>ColdTowne Theater</b> is at 4803 Airport Blvd, Austin, TX 78751<br>
<b>Hideout Theatre</b> is at 617 Congress Ave, Austin, TX 787801</p>

<p>Issues with tickets, website or payment? Email box-office@oobfest.com</p>

<p>Any questions or thoughts about the festival or would like some recommendations? Email ruby@oobfest.com</p>
`



module.exports = {
  sendShowConfirmationEmail: function(recipientEmail, name, where, when, isBadge, quantity) {
    transporter.sendMail({
      to: recipientEmail,
      from: 'box-office@oobfest.com',
      subject: 'Out of Bounds Booking Confirmation',
      html: require('./email-templates/show-confirmation')(name, where, when, isBadge, quantity),
    }, (error, info)=> {
      if(error) console.log(error)
      else return
    })
  },
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
  },
  sendShowDetailsEmail: function(recipientEmail, actInfo) {
    transporter.sendMail({
      to: recipientEmail,
      bcc: "admin@oobfest.com",
      from: "ruby@oobfest.com",
      subject: "OoB 2018 - Your Show Details! Workshops Announced!",
      html: require('./email-templates/performer-show-details').getShowDetailsMessage(actInfo)
    }, (error, info)=> {
      if(error) console.log(error)
      else console.log("SENT! " + recipientEmail)
    })
  },
  sendShowReminderEmail: function(recipientEmail, tickets) {
    transporter.sendMail({
      to: recipientEmail,
      bcc: "admin@oobfest.com",
      from: "box-office@oobfest.com",
      subject: "Out of Bounds Booking Reminder",
      html: require('./email-templates/show-reminder')(tickets)
    }, (error, info)=> {
      if(error) console.log(error)
      else console.log("SENT! ", recipientEmail)
    })
  }
}
