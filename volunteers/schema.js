const mongoose = require('mongoose')

let volunteerSchema = mongoose.Schema({
	name: String,
	email: String,
  phone: String,
  type: String,   // show tech driver party workshop
  hours: Number,
  volunteeredBefore: Boolean,
  referral: String,
  attendingOrientation: Boolean,

  // Driver
  carType: String,
  passenegers: Number,
  licensePlateNumber: String,

  // Tech
  techExperience: String,
  volunteeredTechBefore: Boolean,
})

let Volunteer = mongoose.model('Volunteer', volunteerSchema)

module.exports = Volunteer