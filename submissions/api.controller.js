const model = require('./model')

module.exports = {

	get: function(request, response, next) {
		let submissionId = request.params.submissionId
		model.get(submissionId, (error, submission)=> {
			if(error) next(error)
			else response.send(submission)
		})
	},

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
	},

	standardize: function(request, response, next) {
		let objectId = request.body.objectId
		let city = request.body.city
		let state = request.body.state
		let theater = request.body.theater
		model.standardize(objectId, city, state, theater, (error, submission)=> {
			if(error) next(error)
			else response.send(submission)
		})
	},

	deleteReview: function(request, response, next) {
		let submissionId = request.body.submissionId
		let userId = request.body.userId
		console.log("Params: ", submissionId, userId)
		model.deleteReview(submissionId, userId, (error)=> {
			if(error) next(error)
			else response.send("Success!")
		})
	}
}