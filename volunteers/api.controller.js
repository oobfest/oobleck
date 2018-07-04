const model = require('./model')

module.exports = {

	create: function(request, response, next) {
		let volunteer = request.body
		model.create(volunteer, (error, saved)=> {
			if(error) next(error)
			else response.json(saved)
		})
	},

	getAll: function(request, response, next) {
		model.getAll((error, volunteers)=> {
			if(error) next(error)
			else response.send(volunteers)
		})
	},

	getById: function(request, response, next) {
		let id = request.params.id
		model.get(id, (error, volunteer)=> {
			if(error) next(error)
			else response.send(volunteer)
		})
	},

	update: function(request, response, next) {
		let id = request.params.id
		let volunteer = request.body
		model.update(id, volunteer, (error, volunteer)=> {
			if(error) next(error)
			else response.json(volunteer)
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