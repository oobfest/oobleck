const mongoose = require('mongoose')

let showSchema = mongoose.Schema({
	day: String,
	venue: String,
	time: Number,

  capacity: Number,
  remaining: Number,

	acts: [],
  host: {},
  tickets: []
})

/* Ticket
  
  Name String
  Email String
  Phone String
  Quantity Number
  Badge: false, 'all', 'performer-all', 'performer-upgrade'
  Payment: {paypal}

*/

let Show = mongoose.model('Show', showSchema)

module.exports = Show