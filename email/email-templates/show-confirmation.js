module.exports = function(name, where, when, isBadge, quantity) {
return `
<p>Dear ${name},</p>

<p>This is a confirmation email for the following show:<br>
<b>Where:</b> ${where}<br>
<b>When:</b> ${when}<br>
<b>Quantity:</b> ${quantity}</p>

${isBadge 
  ? '<p>Check-in at the box office <i>at least ten minutes before show time</i> with your badge to pick up your ticket. You will lose your spot if you arrive late or do not have your badge.</p>'
  : '<p>Check-in at the box office <i>at least ten minutes before show time</i> with your name to pick up your ticket. You will lose your spot if you arrive late.</p>'
}

<p>You can email box-office@oobfest.com for any ticket-related concerns and email ruby@oobfest.com for general questions about the festival.</p>
<p><a href="https://goo.gl/forms/lCNpPR68wMBbBRKn2">Please take our audience survey!</a> OoB is a non-profit and taking this survey will help us in accurate reporting to our current and potential funders and sponsors.</p>
`}