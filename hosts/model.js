const Host = require('./schema')
var _ = require('lodash')

module.exports = {

	create: function(host, callback) {
		let newHost = Host(host)
		this.save(newHost, (error, savedHost)=> {
			callback(error, savedHost)
		})
	},

	save: function(host, callback) {
		host.save((error, host)=> {
			callback(error, host)
		})
	},

	get: function(id, callback) {
		Host.findById(id, (error, host)=> {
			callback(error, host)
		})
	},

	getAll: function(callback) {
		Host.find((error, hosts)=> {
			callback(error, hosts)
		})
	},

	update: function(id, newHost, callback) {
		this.get(id, (error, oldHost)=> {
			if(error) callback(error)
			else {
				let updatedHost = _.merge(oldHost, newHost)
				this.save(updatedHost, (error, savedHost)=> {
					callback(error, savedHost)
				})
			}
		})
	},

	delete: function(id, callback) {
		this.get(id, (error, host)=> {
			if(error) callback(error, null)
			host.remove((error, host)=> {
				callback(error, host)
			})
		})
	}

}