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

/*
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

showsModel.getAll((error, shows)=> {
  let showTickets = []
  for(let i=0; i<shows.length; i++) {
    for(let j=0; j<shows[i].tickets.length; j++) {
      let ticket = shows[i].tickets[j]
      ticket.showId = shows[i]._id
      ticket.day = shows[i].day
      ticket.venue = shows[i].venue
      ticket.time = shows[i].time
      ticket.paid = ticket.payment 
        ? Number(ticket.payment.transactions[0].amount.total)
        : 0
      showTickets.push(ticket)
    }
  }
  let ticketsByEmail = _.groupBy(showTickets, 'email')
  let emails = Object.keys(ticketsByEmail)
  for(let email of emails) {
    let show = ticketsByEmail[email]

    console.log(email)
    let tickets = []
    for(let ticket of show) {
      tickets.push(`${ticket.quantity > 1 ? '(' + ticket.quantity + ') ' : '' }${ticket.day}, ${formatTime(ticket.time)}, ${formatVenue(ticket.venue)}`)
    }
    console.log(tickets)

  }
})
*/