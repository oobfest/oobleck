
let submissionsModel = require('./submissions/model')
let showsModel = require('./shows/model')
let emailer = require('./email/model')
submissionsModel.doTheThing((error, submissions)=> {
  showsModel.getAll((error, shows)=> {
    let actInfo = []
    for(let i=0; i<submissions.length; i++) {
      let showDetails = []
      for(let j=0; j<shows.length; j++) {
        for(let k=0; k<shows[j].acts.length; k++) {
          if (shows[j].acts[k]._id == submissions[i]._id) {
            showDetails.push(`${formatTime(shows[j].time)}, ${formatDate(shows[j].day)} at ${shows[j].venue} for ${shows[j].acts[k].duration + " minutes"}`)
          }
        }
      }
      actInfo.push({
        name: submissions[i].actName, 
        email: submissions[i].primaryContactEmail,
        editUrl: "http://app.oobfest.com/submissions/edit/" + submissions[i]._id,
        showDetails: showDetails.length == 2
          ? showDetails[0] + " and " + showDetails[1]
          : showDetails[0]
      })
    }
    for(let info of actInfo) {
      emailer.sendShowDetailsEmail(info.email, info)
    }
  })
})

let formatTime = function(time) {
  time = String(time)
  return time.slice(0, time.length-2) + ":" + time.slice(time.length-2) + "pm"
}

let formatDate = function(date) {
  switch(date) {
    case "Tuesday": return "Tuesday, August 28th"
    case "Wednesday": return "Wednesday, August 29th"
    case "Thursday": return "Thursday, August 30th"
    case "Friday": return "Friday, August 31st"
    case "Saturday": return "Saturday, September 1st"
    case "Sunday": return "Sunday, September 2nd"
    case "Monday": return "Monday, September 3rd"
    default: return date
  }
}