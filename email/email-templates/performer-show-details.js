module.exports = function getShowDetailsMessage(actInfo) {
return 
`<p>Hello!</p>

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