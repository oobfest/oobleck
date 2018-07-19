module.exports = function(name, quantity, badgeType) {
return `
<p>Dear ${name},</p>

<p>This is a confirmation email for the following:<br>
<i>${badgeType}</i><br>
Quantity: ${quantity}</p>

<p>Thank you for purchasing an Out of Bounds Festival badge! This means you get to reserve your ticket to as many shows as you want throughout the entire week.</p>

<p><b>How do I get my badge?</b><br>
We do not mail out badges. We'll let you know soon where and when you'll be able to pick it up. In the mean time, you'll still be able to reserve tickets online with the email address this email was sent to.</p>

<p><b>How do I reserve tickets?</b><br>
You can reserve tickets online at http://oobfest.com/schedule by clicking on the show and the "Reserve with Badge" button. Use the email address that this email was sent to. </p>

<p><b>Then what?</b><br>
Just show up with your badge at least 5 minutes before show time! Your name and email will be listed on our box office sheet the day of the show. You'll be required to show us your badge to receive a ticket.</p>

<p><b>What if I'm late?</b><br>
Unfortunately, <i>if you do not show up at least 5 minutes before the show start time we will release your ticket to others on our wait-list.</i> If you plan on driving, please remember to factor in time it will take to park!</p>

<p>Issues with tickets, website or payment? Email box-office@oobfest.com</p>

<p>General thoughts or questions about shows, the festival, etc? Email ruby@oobfest.com</p>
`
}