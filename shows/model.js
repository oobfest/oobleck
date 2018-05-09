const Show = require('./schema')
var _ = require('lodash')

module.exports = {

	create: function(show, callback) {
		let newShow = Show(show)
		this.save(newShow, (error, savedShow)=> {
			callback(error, savedShow)
		})
	},

	save: function(show, callback) {
		show.save((error, show)=> {
			callback(error, show)
		})
	},

	get: function(id, callback) {
		Show.findById(id, (error, show)=> {
			callback(error, show)
		})
	},

	getAll: function(callback) {
		Show.find((error, shows)=> {
			callback(error, shows)
		})
	},

	update: function(id, newShow, callback) {
		this.get(id, (error, oldShow)=> {
			if(error) callback(error)
			else {
				let updatedShow = _.merge(oldShow, newShow)
				this.save(updatedShow, (error, savedShow)=> {
					callback(error, savedShow)
				})
			}
		})
	},

	delete: function(id, callback) {
		this.get(id, (error, show)=> {
			if(error) callback(error, null)
			show.remove((error, show)=> {
				callback(error, show)
			})
		})
	}

}