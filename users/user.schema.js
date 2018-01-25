const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

let userSchema = mongoose.Schema({
	username: String,
	password: String,
})

userSchema.plugin(passportLocalMongoose)

let User = mongoose.model('User', userSchema)

module.exports = User