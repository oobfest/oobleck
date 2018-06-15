const Day = require('./schema')
var _ = require('lodash')

module.exports = {

	create: function(day, callback) {
		let newDay = Day(day)
		this.save(newDay, (error, savedDay)=> {
			callback(error, savedDay)
		})
	},

	save: function(day, callback) {
		day.save((error, savedDay)=> {
			callback(error, savedDay)
		})
	},

	get: function(id, callback) {
		Day.findById(id, (error, day)=> {
			callback(error, day)
		})
	},

	getAll: function(callback) {
		Day.find((error, days)=> {
			callback(error, days)
		})
	},

	update: function(id, newDay, callback) {

		Day.findByIdAndUpdate(id, newDay, (error, savedDay)=> {
			callback(error, savedDay)
		})

		/*

		// The results from _.merge isn't saveable? 

		this.get(id, (error, oldDay)=> {
			if(error) callback(error)
			else {
				oldDay = _.merge(oldDay, newDay)
				//console.log(updatedDay)
				this.save(oldDay, (error, savedDay)=> {
					console.log(savedDay)
					callback(error, savedDay)
				})
			}
		})*/
	},

	delete: function(id, callback) {
		this.get(id, (error, day)=> {
			if(error) callback(error, null)
			day.remove((error, day)=> {
				callback(error, day)
			})
		})
	}

}