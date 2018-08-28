require('./setup/environment-variables')()

const express = require('express')
const app = express()

const path = require('path')
app.use(express.static(path.join(__dirname, 'public/')))

require('./setup/express')(app)
require('./setup/compression')(app)
require('./setup/body-parser')(app)
require('./setup/express-session')(app)
require('./setup/logging')(app)
require('./setup/passport')(app)
require('./setup/routes')(app)
require('./setup/database')()
require('./setup/paypal')()

const log = require('winston')

// ERROR STUFF
// https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
process.on('uncaughtException', (error)=> { 
	log.error("UNCAUGHT EXCEPTION :(")
	log.error("[Inside 'uncaughtException' event] " + error.stack || error.message )
	process.exit(1)
})

// Listen!
app.listen(process.env.PORT, ()=> {
	log.info("🐵  Listening on port " + process.env.PORT)
})


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

/*
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

  let emails = []
  for(let email of Object.keys(groupedTickets)) {
    let tickets = []
    for(let ticket of groupedTickets[email]) {
      tickets.push(`${ticket.quantity > 1 ? '(' + ticket.quantity + ') ' : '' }${ticket.day}, ${formatTime(ticket.time)}, ${formatVenue(ticket.venue)}`)
    }
    emails.push({
      email: email,
      tickets: tickets
    })
  }

  console.log(emails)
})
*/