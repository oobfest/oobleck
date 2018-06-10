const model = require('./model')

module.exports = {

	create: function(request, response, next) {
		let day = request.body
		model.create(day, (error, saved)=> {
			if(error) next(error)
			else response.json(saved)
		})
	},

	getAll: function(request, response, next) {
		model.getAll((error, days)=> {
			if(error) next(error)
			else response.send(days)
		})
	},

	getById: function(request, response, next) {
		let id = request.params.id
		model.get(id, (error, day)=> {
			if(error) next(error)
			else response.send(day)
		})
	},

	update: function(request, response, next) {
		let id = request.params.id
		let day = request.body
		model.update(id, day, (error, day)=> {
			if(error) next(error)
			else response.json(day)
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