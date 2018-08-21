const mongoose = require('mongoose')

let showSchema = mongoose.Schema({
	day: String,
	venue: String,
	time: Number,

  endTime: String,  // This was very, very tacked on last-minute

  capacity: Number,
  remaining: Number,
  price: Number,

	acts: [],
  host: {},
  tickets: [],

  volunteerBoxOffice1: mongoose.Schema.Types.ObjectId,
  volunteerBoxOffice2: mongoose.Schema.Types.ObjectId,
  volunteerTicketTaker1: mongoose.Schema.Types.ObjectId,
  volunteerTicketTaker2: mongoose.Schema.Types.ObjectId,
})

/* Ticket
  ID  
  Name String
  Email String
  Phone String
  Quantity Number
  Badge: 
    false, 
    'all', 
    'performer-all', 
    'performer-weekend-upgrade'
    'volunteer'
    'staff'
    'panelist'
    'comp'
  Payment: {paypal}, false
*/

/* Act
  name
  type
  _id
  duration
  imageUrl
  domain
  public description
*/

let Show = mongoose.model('Show', showSchema)

module.exports = Show