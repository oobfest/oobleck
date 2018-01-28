const User = require('../users/user.schema')

let userApi = {

	createuser: function(username, password) {
		// Special "register" method from mongoose-passport
		User.register(new User({ username: username }), password, function(error, user) {
			if(error) throw Error("Failed to create user")
			return user
		})
	},

	getUser: function(objectId, callback) {
		User.findById(objectId, (error, user)=> {
			if(error) throw Error("Failed to get user by ID")
			callback(user)
		})
	},

	getAllUsers: function(callback) {
		User.find((error, users)=> {
			console.log("Yippee", users)
			if (error) throw Error("Failed to get all users")
			callback(users)
		})
	},

	deleteUser: function(objectId, callback) {
		getUser(objectId, (user)=> {
			user.remove((error, user)=> {
				if (error) throw Error("Failed to delete user")
				callback(user)
			})
		})
	}
}

module.exports = userApi