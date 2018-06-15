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

function sendEmail(transporter, to, by, bcc, subject, htmlMessage) {
  transporter.sendMail(
    {
      to: recipients,
      from: by,
      bcc: bcc,
      subject: subject,
      html: message
    },
    (error, info) => {
      if (error) console.log(error)
      else console.log(info.envelope)
    }
  )
}