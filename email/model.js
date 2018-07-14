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

function getShowDetailsMessage(actInfo) {
  return `<p>Hello!</p>

<p>First, join our <a href='https://www.facebook.com/groups/1981920545175562/'>super secret Facebook group</a> if you haven't already! There's already over 150 performers in there, woot woot!</p>

<p>Second, if you are getting this for a stand-up act, that's a mistake! Reply back to this email so we can sort that out. Stand-ups will find out their set lengths closer to the fest.</p>

<p><b>Your Show Details</b><br>
Your show is "<i>${actInfo.name}</i>"<br>
You're performing <i>${actInfo.showDetails}</i></p>

<p><b>Worried that you're double-booked?</b>
<ul>
  <li>Each show block has three shows in it</li>
  <li>If you are in two different acts with the same show block time, you're likely in the first show of one block and in the third show of the other</li>
  <li>If you're still concerned, reply back to this email and we can confirm things!</li>
</ul>
</p>

<p><b>Need to update your picture or cast list?</b><br>
You can update your act information here: ${actInfo.editUrl}<br>
Individual tickets are going on sale soon so do it quick!</p>

<p><b>Workshops</b><br>
We have just announced <a href="http://oobfest.com/workshops/">this year's workshops</a>, so check them out!<br>
Workshops are at a discounted "early bird" rate until August 1st</p> 

<p><b>Hotels</b><br>
If you're from out of town, <a href='http://hiltongardeninn.hilton.com/en/gi/groups/personalized/A/AUSGIGI-OBCF18-20180828/index.jhtml'>get a discounted hotel room before we run out</a>.</p>
<p>Don't hesitate to email ruby@oobfest.com if you have any questions.</p>

<p>Sincerely,<br>
rOoBy</p>
`}


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
  },
  sendShowDetailsEmail: function(recipientEmail, actInfo) {
    transporter.sendMail({
      to: recipientEmail,
      bcc: "admin@oobfest.com",
      from: "ruby@oobfest.com",
      subject: "OoB 2018 - Your Show Details! Workshops Announced!",
      html: getShowDetailsMessage(actInfo)
    }, (error, info)=> {
      if(error) console.log(error)
      else console.log("SENT! " + recipientEmail)
    })
  }
}
