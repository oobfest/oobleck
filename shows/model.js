const Show = require('./schema')
var _ = require('lodash')

module.exports = {

	temp: function() {
		this.getAll((error, shows)=> {
			for(let show of shows) {
				show.capacity = 50
				show.remaining = 50
				this.save(show, ()=> {})
			}
		})
		console.log("Set show tickets to 50")
	},

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

	getByActId: function(actId, callback) {
		Show.find({'acts._id': actId}, (error, shows)=> {
			callback(error, shows)
		})
	},

	update: function(id, newShow, callback) {
		this.get(id, (error, oldShow)=> {
			if(error) callback(error)
			else {
				let updatedShow = newShow //_.merge(oldShow, newShow)
				this.save(updatedShow, (error, savedShow)=> {
					callback(error, savedShow)
				})
			}
		})
	},

	updateDuration: function(showId, act, callback) {
		this.get(showId, (error, oldShow)=> {
			if(error) callback(error)
			else {
				let index = oldShow.acts.findIndex(a=> a._id.toString() == act._id)
				oldShow.acts[index] = act
				oldShow.markModified('acts') 
				this.save(oldShow, (error, savedShow)=> {
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
	},

	addAct: function(id, act, callback) {
		this.get(id, (error, show)=> {
			if(error) callback(error)
			else {
				show.acts.push(act)
				this.save(show, (error, savedShow)=> {
					callback(error, savedShow)
				})
			}
		})
	}
}