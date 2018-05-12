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
	theaterTags: [String],

	// Personnel
	primaryContactName: String,
	primaryContactEmail: String,
	primaryContactPhone: String,
	primaryContactRole: String,
	primaryContactAttending: Boolean,
	additionalMembers: Array,

	// Performance Needs
	minimumShowLength: Number,
	maximumShowLength: Number,
	specialNeeds: String,
	noFood: Boolean,

	// Photo
	imageUrl: String,
	deleteImageUrl: String,

	// Video
	videoUrls: Array,
	videoInfo: String,

	// Social Media
	socialMedia: Array,

	// Availability
	available: Array,
	conflicts: Array,

	// Application Fee
	paymentInfo: {},

	// Reviews!
	reviews: [{ 
		userId: String, 
		username: String,
		score: Number, 
		notes: String
	}],

	// State
	state: String

	// Mongoose loses the ability to auto-detect and save changes of Mixed type.
	// To tell Mongoose that the value of a Mixed type has changed call `.markModified(path)`

	// For example...
	// submission.paymentInfo = { ... }
	// submission.markModified('paymentInfo')
	// submission.save()

})

let Submission = mongoose.model('Submission', submissionSchema)

module.exports = Submission