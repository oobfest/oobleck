const mongoose = require('mongoose')

let showSchema = mongoose.Schema({
	day: String,
	venue: String,
	time: Number,
	acts: [],
  host: {}
})

let Show = mongoose.model('Show', showSchema)

module.exports = Show