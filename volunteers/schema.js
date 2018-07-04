const mongoose = require('mongoose')

let volunteerSchema = mongoose.Schema({
	name: String,
	email: String
})

let Volunteer = mongoose.model('Volunteer', volunteerSchema)

module.exports = Volunteer