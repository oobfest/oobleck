const mongoose = require('mongoose')

let hostSchema = mongoose.Schema({
	name: {
		type: String,
 		required: [true, 'Host must have a name']
 	},
	email: {
		type: String,
		required: [true, 'Host must have an email address']
	},
	phone: {
		type: String,
		required: [true, 'Host must have a phone number']
	},
	bio: {
		type: String,
		required: [true, 'Host nust have a bio']
	}, 
	experience: String,
	videoUrl: String,
	imageUrl: String,
	deleteImageUrl: String,
	available: Array,
	canAttendMeeting: Boolean
})

let Host = mongoose.model('Host', hostSchema)

module.exports = Host