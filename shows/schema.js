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