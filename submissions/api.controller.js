const model = require('./model')

module.exports = {

	getAll: function(request, response, next) {
		model.getAll((error, submissions)=> {
			if(error) next(error)
			else response.send(submissions)
		})
	},

	getAllPaid: function(request,response, next) {
		model.getAllPaid((error, submissions)=> {
			if(error) next(error)
			else response.send(submissions)
		})
	},

	getAllPaidExceptStandup: function(request,response, next) {
		model.getAllPaidExceptStandup((error, submissions)=> {
			if(error) next(error)
			else response.send(submissions)
		})
	},

	getAllPaidStandup: function(request,response, next) {
		model.getAllPaidStandup((error, submissions)=> {
			if(error) next(error)
			else response.send(submissions)
		})
	},

	addTheaterTag: function(request, response, next) {
		let objectId = request.body.objectId
		let tag = request.body.tag
		model.addTheaterTag(objectId, tag, (error, submission)=> {
			if(error) next(error)
			else response.send(submission)
		})
	},

	removeTheaterTag: function(request, response, next) {
		let objectId = request.body.objectId
		let tag = request.body.tag
		model.removeTheaterTag(objectId, tag, (error, submission)=> {
			if(error) next(error)
			else response.send(submission)
		})
	}
}