const model = require('./model')

module.exports = {

	create: function(request, response, next) {
		let host = request.body
		model.create(host, (error, saved)=> {
			if(error) next(error)
			else response.json(saved)
		})
	},

	getAll: function(request, response, next) {
		model.getAll((error, hosts)=> {
			if(error) next(error)
			else response.send(hosts)
		})
	},

	getById: function(request, response, next) {
		let id = request.params.id
		model.get(id, (error, host)=> {
			if(error) next(error)
			else response.send(host)
		})
	},

	update: function(request, response, next) {
		let id = request.params.id
		let host = request.body
		model.update(id, host, (error, host)=> {
			if(error) next(error)
			else response.json(host)
		})
	},

	delete: function(request, response, next) {
		let id = request.params.id
		model.delete(id, (error)=> {
			if(error) next(error)
			else response.status(204).end()
		})
	}
}