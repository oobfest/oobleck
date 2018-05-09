const mongoose = require('mongoose')

let showSchema = mongoose.Schema({
	day: String,
	venue: String,
	time: String,
	acts: []
})

let Show = mongoose.model('Show', showSchema)

module.exports = Show