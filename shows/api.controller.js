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

	getByActId: function(request, response, next) {
		let actId = convertToMongoId(request.params.actId)
		model.getByActId(actId, (error, shows)=> {
			if(error) next(error)
			else response.send(shows)
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

	updateDuration: function(request, response, next) {
		let showId = request.params.id
		let act = request.body
		model.updateDuration(showId, act, (error, show)=> {
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

	setHost: function(request, response, next) {
		let showId = request.params.id
		let host = request.body
		model.get(showId, (error, show)=> {
			if(error) next(error)
			else {
				show.host = host
				model.update(showId, show, (error, savedShow)=> {
					if(error) next(error)
					else response.json(savedShow)
				})
			}
		})
	},

	removeHost: function(request, response, next) {
		let showId = request.params.id
		model.get(showId, (error, show)=> {
			if(error) next(error)
			else {
				show.host = null
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
	},

	getShows: function(request, response, next) {
		model.getShows((error, shows)=> {
			if(error) next(error)
			else response.json(shows)
		})
	},

	getShowById: function(request, response, next) {
		let id = request.params.id
		model.getShowById(id, (error, show)=> {
			if(error) next(error)
			else response.json(show)
		})
	},

	badgeReservation: function(request, response, next) {
		let showId = request.params.id
		let email = request.body.email
		let quantity = request.body.quantity
		model.badgeReservation(showId, email, quantity, (error, status)=> {
			if(error) next(error)
			else {
		    response.header("Access-Control-Allow-Origin", "*")
		    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
				response.json(status)
		})
	}, 

	removeReservation: function(request, response, next) {
		let showId = request.params.id
		let ticketId = request.body.ticketId
		model.removeReservation(showId, ticketId, (error, savedShow)=> {
			if(error) next(error)
			else response.json(savedShow)
		})
	},

	coorz: function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*")
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    response.json({yay: true})
	},

	clearTickets: function(request, response, next) {
		let showId = request.params.id
		model.clearTickets(showId, (error, yay)=> {
			response.json({yay: true})
		})
	},

	setCapacity: function(request, response, next) {
		let showId = request.params.id
		let capacity = request.body.capacity
		model.setCapacity(showId, capacity, (error, savedShow)=> {
			if(error) next(error)
			else response.json(savedShow)
		})
	}
}