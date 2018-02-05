const User = require('../users/user.schema')

let userApi = {

	create: function(user, callback) {
		// Special "register" method from mongoose-passport
		User.register(new User({ username: user.username, roles: user.roles }), user.password, function(error, newUser) {
			if(error) throw Error("Failed to create user")
			return callback(newUser)
		})
	},

	save: function(user, callback) {
		user.save((error, savedUser)=> {
			if (error) throw Error("Failed to save user")
			callback(savedUser)
		})
	},

	get: function(objectId, callback) {
		User.findById(objectId, (error, user)=> {
			if(error) throw Error("Failed to get user by ID")
			callback(user)
		})
	},

	getAll: function(callback) {
		User.find((error, users)=> {
			if (error) throw Error("Failed to get all users")
			callback(users)
		})
	},

	update: function(objectId, updatedUser, callback) {
		this.get(objectId, (user)=> {
			user.username = updatedUser.username
			user.roles = updatedUser.roles
			this.save(user, (savedUser)=> {
				callback(savedUser)
			})
		})
	},

	updateRoles: function(objectId, roles, callback) {
		this.get(objectId, (user)=> {
			user.roles = roles
			this.save(user, (savedUser)=> {
				callback(savedUser)
			})
		})
	},

	delete: function(objectId, callback) {
		this.get(objectId, (user)=> {
			user.remove((error, user)=> {
				if (error) throw Error("Failed to delete user")
				callback(user)
			})
		})
	}
}

module.exports = userApi