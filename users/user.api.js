const User = require('../users/user.schema')

let userApi = {

	createUser: function(user, callback) {
		// Special "register" method from mongoose-passport
		User.register(new User({ username: user.username }), user.password, function(error, newUser) {
			if(error) throw Error("Failed to create user")
			return callback(newUser)
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
			if (error) throw Error("Failed to get all users")
			callback(users)
		})
	},

	deleteUser: function(objectId, callback) {
		this.getUser(objectId, (user)=> {
			user.remove((error, user)=> {
				if (error) throw Error("Failed to delete user")
				callback(user)
			})
		})
	}
}

module.exports = userApi