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

function getRecipients(submission) {
  let recipients = []
  recipients.push(submission.primaryContactEmail)
  for(let i=0; i<submission.additionalMembers.length; i++){
    recipients.push(submission.additionalMembers[i].email)
  }
  return recipients
}

function sendRejectionEmail(transporter, actName, isStandup, recipients) {
  transporter.sendMail(
    {
      from: '',
      to: recipients,
      bcc: [],
      subject: "Thank You for Applying to Out of Bounds 2018",
      html: isStandup
        ? `Dear fellow performer,<br><br>We regret to inform you that we are unable to include your stand-up act in this year's Out of Bounds line-up.<br><br>Thank you for applying, and let me just say that the talent we have had to turn away this year makes my head spin. <b>The acceptance rate for stand-ups was 19%</b>, so long story short, this festival is tough to get into. Instead of invoking discouragement, I hope this inspires you to keep working, keep performing, keep trying and failing and trying and succeeding so that you can explode our 2019 panel's brains with your awesomeness and join us in future years.<br><br>If you are in Austin for Labor Day Weekend, we do hope to see you as an audience member, workshop attendee and/or party go-er (EVERYONE IS INVITED TO THE PARTIES!). The mission of Out of Bounds is to provide a diverse arena for artists to connect, educate, learn and thrive, and we'd love for you to still be a part of that mission.<br><br>Sincerely,<br>Ruby Willmann - Executive Director of Out of Bounds`
        : `Hello,<br><br>We regret to inform you that we are unable to include <i>${actName}</i> in this year's Out of Bounds line-up.<br><br>Thank you for applying, and let me just say that the talent we have had to turn away this year makes my head spin. <b>In total, we received 415 submissions and our acceptance rate was 23%.</b> In truth, every year Out of Bounds will become more competitive due to the rising tide of talent in both Austin and the national scene. Last year our acceptance rate was 25%. This year it was 23%. This festival is hard to get into, and instead of invoking discouragement, I hope this inspires you to keep working, keep rehearsing, keep trying and failing and trying and succeeding so that you can explode our 2019 panel's brains with your awesomeness and join us in future years.<br><br>If you are in Austin for Labor Day Weekend, we do hope to see you as an audience member, workshop attendee and/or party go-er (EVERYONE IS INVITED TO THE PARTIES!). The mission of Out of Bounds is to provide a diverse arena for artists to connect, educate, learn and thrive, and we'd love for you to still be a part of that mission. <br><br>Sincerely,<br>Ruby Willmann - Executive Director of Out of Bounds<br><br>P.S. Almost everyone wants to know why they weren't accepted, so before you email me asking, please know we don't have the bandwidth to go into detail for each individual act. But, we did ask our panel what were the three main reasons for rejection, and I wrote them out below. None of these may apply to you (or perhaps they all apply to you). Only you can be the true judge of your talent and ability and effort, but I hope these can help inform us all how we can strengthen our submissions for future festivals and opportunities beyond:<br><br>1) <b>Your Video Submission</b>: If we can’t see you we can’t rate you. If we can’t hear you we can’t rate you. If your link is faulty, you may not get the full attention of the screening staff.  Great performers and groups did not get selected because their tapes were over 3 years old, or we got only a sampling of the work, or we got sets with obvious edits. Or maybe there was no show, just a description or ad for the show.  We want to reward acts who are thorough and hungry and who made the effort to put their best foot forward.<br><br>2) <b>Your Schedule</b>: Maybe you were great, but your schedule wasn't. Maybe it was too rigid and did not fit our needs.  Mighty fine acts who were only available for 1-3 days forced us to make really tough decisions. Not everyone can play on Friday and Saturday.<br><br>3) <b>Your Vibe</b>: Our panelists are watching over 150 videos each. Dozens of Harolds start to run together like a blur. The same jokes start to play on repeat. How are you standing out? How are you innovative? Surprising? Thoughtful? Unique? We rewarded groups that featured a variety of perspectives, were bold, took risks with their art-form, were inclusive and strove to perform subject matter that left everyone laughing. We were also attentive to content (hint: comedy leaning on racism? no thanks), and to those subtle but stinging moments where members of a troupe are treated more like punchlines than like team-mates. Unfortunately, no matter how funny you are, that's just not the type of humor we're going for.`
    },
    (error, info) => {
      if (error) console.log(error)
      else console.log(info.envelope)
    }
  )
}

// Get Submissions
let Submissions = require("../submissions/model")
Submissions.getAllPaid((error, submissions) => {
  if (error) console.log(error)
  else {
    // create Nodemailer SES transporter
    let transporter = createTransporter()
    let count = 0
    let rejectedSubmissions = submissions.filter(s=> s.stamp ==='out' && s.showType!=='Stand-Up')
    for(let i=0; i<rejectedSubmissions.length; i++) {
      console.log(rejectedSubmissions[i].primaryContactName)
      for(let j=0; j<rejectedSubmissions[i].additionalMembers.length; j++){
        console.log(rejectedSubmissions[i].additionalMembers[j].name)
        //console.log(rejectedSubmissions[i].additionalMembers[j].email)
      }
    }
  }

})