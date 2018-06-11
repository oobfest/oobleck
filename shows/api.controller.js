const convertToMongoId = require('mongoose').Types.ObjectId
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

	addAct: function(request, response, next) {
		let id = request.params.id
		let act = {
			name: request.body.actName,
			type: request.body.showType,
			_id: convertToMongoId(request.body._id)
		}
		model.get(id, (error, show)=> {
			if(error) next(error)
			else {
				show.acts.push(act)
				model.update(id, show, (error, savedShow)=> {
					if(error) next(error)
					else response.json(savedShow)
				})
			}
		})
	},

	removeAct: function(request, response, next) {
		let showId = request.body.showId
		let actId = request.body.actId
		model.get(showId, (error, show)=> {
			if(error) next(error)
			else {
				show.acts.splice(show.acts.findIndex(act=> act._id == actId), 1)
				show.markModified('acts')
				model.update(showId, show, (error, savedShow)=> {
					if(error) next(error)
					else response.json(savedShow)
				})
			}
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