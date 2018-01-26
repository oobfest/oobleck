// Code to run to create a user
// (No need for public registration)
const User = require('../users/user.schema')

function createUser(username, password) {
	console.log("Creating user...")
	User.register(new User({ username: username }), password, function(error, user) {
		if(error) {
			console.log("Error :(", error)
		}
		console.log("User " + username + " created successfully")
	})
}