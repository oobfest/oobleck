
let showsModel = require('./shows/model')
let _ = require('lodash')
let formatTime = function(time) { 
  time = String(time)
  return time.slice(0, time.length-2) + ":" + time.slice(time.length-2) + "pm" 
}
let formatVenue = function(venue) {
  switch(venue) {
    case 'Hideout Down': return 'Hideout Downstairs'
    case 'Hideout Up': return 'Hideout Upstairs'
    case 'ColdTowne': return 'ColdTowne'
    case 'Fallout': return 'Fallout'
    case 'Velveeta': return 'Velveeta Room'
    case 'Spider House': return 'Spider House Ballroom'
    case 'Institution': return 'Institution'
    default: return venue
  }
}


let emailer = require('./email/model')
// Get all shows
showsModel.getAll((error, shows)=> {
  let ungroupedTickets = []

  // For each show
  for(let i=0; i<shows.length; i++) {

    // For each ticket in the show
    for(let j=0; j<shows[i].tickets.length; j++) {

      // Add ticket to ungrouped array
      ungroupedTickets.push({
        email: shows[i].tickets[j].email,
        quantity: shows[i].tickets[j].quantity,
        day: shows[i].day,
        venue: shows[i].venue,
        time: shows[i].time,
      })
    }
  }

  // Group array by each ticket's email
  let groupedTickets = _.groupBy(ungroupedTickets, 'email')

  let people = []
  for(let email of Object.keys(groupedTickets)) {
    let tickets = []

    for(let ticket of groupedTickets[email]) {
      let ticketQuantity = Number(ticket.quantity)
      tickets.push(`${ticketQuantity > 1 ? '(' + ticketQuantity + ') ' : '' }${ticket.day}, ${formatTime(ticket.time)}, ${formatVenue(ticket.venue)}`)
    }
    people.push({
      email: email,
      tickets: tickets
    })
  }

  for(let person of people) {
    let showReminderEmail = require('./email/email-templates/show-reminder')
    emailer.sendShowReminderEmail(person.email, person.tickets)
  }
})