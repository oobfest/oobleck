const mongoose = require('mongoose')

let hostSchema = mongoose.Schema({

	name: String,
	email: String,
	bio: String,
	experience: String,
	videoUrl: String,

	imageUrl: String,
	deleteImageUrl: String

})

let Host = mongoose.model('Host', hostSchema)

module.exports = Host