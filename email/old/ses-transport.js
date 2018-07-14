let nodemailer = require("nodemailer")
let aws = require("aws-sdk")

// No need to config credentials,
// AWS_REGION, AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY are automatically detected
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-environment.html

function createTransporter() {
  return nodemailer.createTransport({
    SES: new aws.SES({
      apiVersion: "2010-12-01"
    }),
    sendingRate: 1
  })
}

function sendEmail(transporter, recipient, htmlMessage, subject) {
  transporter.sendMail(
    {
      to: recipient,
      bcc: "admin@oobfest.com",
      from: "ruby@oobfest.com",
      subject: subject || "Confirm Attendance to Out of Bounds 2018",
      html: htmlMessage
    },
    (error, info) => {
      if (error) console.log(error)
      else console.log(info.envelope)
    }
  )
}

function getMessage(actId, actName, actType) {
  if (actType === 'Stand-Up') return `<p>Congratulations, ${actName}! You have been accepted to the Out of Bounds Comedy Festival.</p>
<p>Here is what you can expect at our fest!</p>
<ul>
  <li>Airport ride to & from the airport</li>
  <li>At least two shows in the festival, maybe more depending on availability</li>
  <li>Festival T-Shirt</li>
  <li>Festival Performer Badge (if a show is starting and has empty seats, you get in for free!)</li>
  <li>Nightly Parties</li>
  <li>A free professional video recording of all sets at The Velveeta Room</li>
</ul>
<p>BUT before we officially add you to our line-up, please confirm your attendance at the following link:</p>
https://app.oobfest.com/submissions/accept/${actId}`
  else return `<p>Congratulations, ${actName}! You have been accepted to the Out of Bounds Comedy Festival.</p>
<p>Here is what you can expect at our fest!</p>
<ul>
  <li>Free ride to & from the airport</li>
  <li>Two shows in the festival (one show if you're local)</li>
  <li>Festival T-Shirt</li>
  <li>Festival Performer Badge (if a show is starting and has empty seats, you get in for free!)</li>
  <li>Nightly Parties</li>
</ul>
<p>BUT before we officially add you to our line-up, please confirm your attendance at the following link:</p>
https://app.oobfest.com/submissions/accept/${actId}
`
}

function sendAcceptanceEmails() {
  let transporter = createTransporter()
  let submissionsModel = require('../submissions/model')
  let submissions = submissionsModel.getAllAccepted((error, submissions)=> {
    for(let submission of submissions) {
      sendEmail(transporter, submission.primaryContactEmail, getMessage(submission._id, submission.actName, submission.showType))
    }
  })  
}



function sendShowDetailsEmail(actInfo) {
  let transporter = createTransporter()
  let recipient = 'ruby@oobfest.com'
  let subject = "OoB 2018 - Your Show Details! Workshops Announced!"
}

