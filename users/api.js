const User = require('../users/schema')

let userApi = {

	create: function(user, callback) {
		let newUser = User(user)
		this.save(newUser, (error, savedUser)=> {
			callback(error, savedUser)
		})
	},

	createWithPassword: function(user, callback) {
		// Special "register" method from mongoose-passport
		User.register(new User({ username: user.username, roles: user.roles }), user.password, function(error, newUser) {
			callback(error, newUser)
		})

	},

	setPassword: function(objectId, password, callback) {
		this.get(objectId, (error, user)=> {
			if(error) return callback(error, null)
			if(user == null) return callback(new Error("User not found"), null)
			user.setPassword(password, (error)=> {
				if(error) return callback(error, null)
				user.isPasswordSet = true
				this.save(user, (error, savedUser)=> {
					callback(error, savedUser)
				})
			})
		})
	},

	changePassword: function(objectId, oldPassword, newPassword, callback) {
		this.get(objectId, (error, user)=> {
			if(error) return callback(error, null)
			if(user == null) return callback(new Error("User not found"), null)
			user.changePassword(oldPassword, newPassword, (error)=> {
				if(error) return callback(error, null)
				this.save(user, (error, savedUser)=> {
					callback(error, savedUser)
				})
			})
		})
	},

	save: function(user, callback) {
		user.save((error, savedUser)=> {
			callback(error, savedUser)
		})
	},

	get: function(objectId, callback) {
		User.findById(objectId, (error, user)=> {
			callback(error, user)
		})
	},

	getAll: function(callback) {
		User.find((error, users)=> {
			callback(error, users)
		})
	},

	update: function(objectId, updatedUser, callback) {
		this.get(objectId, (error, user)=> {
			if(error) return callback(error, null)
			user.username = updatedUser.username
			user.email = updatedUser.email
			user.roles = updatedUser.roles
			this.save(user, (error, savedUser)=> {
				callback(error, savedUser)
			})
		})
	},

	updateRoles: function(objectId, roles, callback) {
		this.get(objectId, (error, user)=> {
			if(error) return callback(error, null)
			user.roles = roles
			this.save(user, (error, savedUser)=> {
				callback(error, savedUser)
			})
		})
	},

	delete: function(objectId, callback) {
		this.get(objectId, (error, user)=> {
			if(error) return callback(error, null)
			user.remove((error, user)=> {
				callback(error, user)
			})
		})
	}
}

module.exports = userApi