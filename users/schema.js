const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

let userSchema = mongoose.Schema({
	email: String,
	username: String,
	isPasswordSet: Boolean,
	roles: []
})

userSchema.plugin(passportLocalMongoose)

let User = mongoose.model('User', userSchema)

module.exports = User