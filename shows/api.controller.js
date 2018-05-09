const model = require('./model')

module.exports = {

	create: function(request, response, next) {
		let show = request.body
		model.create(show, (error, saved)=> {
			if(error) next(error)
			else response.json(saved)
		})
	},

	getAll: function(request, response, next) {
		model.getAll((error, shows)=> {
			if(error) next(error)
			else response.send(shows)
		})
	},

	getById: function(request, response, next) {
		let id = request.params.id
		model.get(id, (error, show)=> {
			if(error) next(error)
			else response.send(show)
		})
	},

	update: function(request, response, next) {
		let id = request.params.id
		let show = request.body
		model.update(id, show, (error, show)=> {
			if(error) next(error)
			else response.json(show)
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