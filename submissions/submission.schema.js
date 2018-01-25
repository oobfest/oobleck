const mongoose = require('mongoose')

let submissionSchema = mongoose.Schema({

	// Act Details
	actName: String,
	showType: String,
	informalDescription: String,
	publicDescription: String,
	accolades: String,

	// Location
	country: String,
	city: String,
	state: String,
	homeTheater: String,

	// Personnel
	primaryContactName: String,
	primaryContactEmail: String,
	primaryContactPhone: String,
	primaryContactRole: String,
	additionalMembers: Array,

	// Performance Needs
	showLength: Number,
	specialNeeds: String,

	// Photo
	photoUrl: String,

	// Video
	videoUrl: String,
	videoInfo: String,

	// Social Media
	socialMediaType: Array,
	socialMediaUrl: Array,

	// Availability
	available: Array,
	conflicts: String,

	// Application Fee
	payedFee: Boolean

})

let Submission = mongoose.model('Submission', submissionSchema)

module.exports = Submission