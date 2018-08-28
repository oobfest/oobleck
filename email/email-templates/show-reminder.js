module.exports = function (shows) {
return `
<p>Hello!</p>

<p>Here's a quick reminder that you have tickets for the following Out of Bounds shows:</p>

<ul>
${shows.map((show) => `<li>${show}</li>`).join('\n')}
</ul>

<p>Pick up your ticket(s) at the venue's box office <i>at least ten minutes before the show</i>. If you are late, you are at risk of losing your spot. No one is allowed to enter the theater 15 minutes after the show begins.</p>

<p>If you have a badge, a friendly reminder that you must show your badge at the box office to retrieve your ticket. Please pick up your badge at registration, happening at The Hideout Theater (617 Congress Avenue) every evening of the festival from 6:30pm-10pm.</p>

<p>Thank you!</p>
`}