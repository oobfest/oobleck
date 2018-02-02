const mongoose = require('mongoose')

let submissionSchema = mongoose.Schema({

	// Act Details
	actName: String,
	domain: String,
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
	imageUrl: String,
	deleteImageUrl: String,

	// Video
	videoUrl: String,
	videoInfo: String,

	// Social Media
	socialMedia: Array,

	// Availability
	available: Array,
	conflicts: String,

	// Application Fee
	payedFee: Boolean

})

let Submission = mongoose.model('Submission', submissionSchema)

module.exports = Submission