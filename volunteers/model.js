const Volunteer = require('./schema')
var _ = require('lodash')

module.exports = {

	create: function(volunteer, callback) {
		let newVolunteer = Volunteer(volunteer)
		this.save(newVolunteer, (error, savedVolunteer)=> {
			callback(error, savedVolunteer)
		})
	},

	save: function(volunteer, callback) {
		volunteer.save((error, volunteer)=> {
			callback(error, volunteer)
		})
	},

	get: function(id, callback) {
		Volunteer.findById(id, (error, volunteer)=> {
			callback(error, volunteer)
		})
	},

	getAll: function(callback) {
		Volunteer.find((error, volunteers)=> {
			callback(error, volunteers)
		})
	},

	update: function(id, newVolunteer, callback) {
		this.get(id, (error, oldVolunteer)=> {
			if(error) callback(error)
			else {
				let updatedVolunteer = _.merge(oldVolunteer, newVolunteer)
				this.save(updatedVolunteer, (error, savedVolunteer)=> {
					callback(error, savedVolunteer)
				})
			}
		})
	},

	delete: function(id, callback) {
		this.get(id, (error, volunteer)=> {
			if(error) callback(error, null)
			volunteer.remove((error, volunteer)=> {
				callback(error, volunteer)
			})
		})
	}

}