const mongoose = require('mongoose')

let daySchema = mongoose.Schema({
	order: Number,
	name: String,
	venues: [String]
})

let Day = mongoose.model('Day', daySchema)

module.exports = Day