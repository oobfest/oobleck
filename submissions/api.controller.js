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

	getAllAccepted: function(request, response, next) {
		model.getAllAccepted((error, submissions)=> {
			if(error) next(error)
			else response.send(submissions)
		})
	},

	getAllPaidExceptStandup: function(request, response, next) {
		model.getAllPaidExceptStandup((error, submissions)=> {
			if(error) next(error)
			else response.send(submissions)
		})
	},

	getAllPaidStandup: function(request, response, next) {
		model.getAllPaidStandup((error, submissions)=> {
			if(error) next(error)
			else response.send(submissions)
		})
	},

  getValidActs: function(request, response, next) {
    model.getValidActs((error, acts)=> {
      if(error) response.send({error})
      else response.send(acts)
    })
  },

  getActByDomain: function(request, response, next) {
    let domain = request.params.domain
    model.getActByDomain(domain, (error, act)=> {
      if(error) response.send({error})
      else response.send(act)
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

	stampAccept: function(request, response, next) {
		let objectId = request.body.objectId
		model.stampAccept(objectId, (error, submission)=> {
			if(error) next(error)
			else response.send(submission)
		})
	},

	stampPurgatory: function(request, response, next) {
		let objectId = request.body.objectId
		model.stampPurgatory(objectId, (error, submission)=> {
			if(error) next(error)
			else response.send(submission)
		})
	},

	stampReject: function(request, response, next) {
		let objectId = request.body.objectId
		model.stampReject(objectId, (error, submission)=> {
			if(error) next(error)
			else response.send(submission)
		})
	},

	addNote: function(request, response, next) {
		let objectId = request.body.objectId
		let note = request.body.note
		model.addNote(objectId, note, (error, savedSubmission)=> {
			if(error) next(error)
			else response.send(savedSubmission)
		})
	},

	deleteReview: function(request, response, next) {
		let submissionId = request.body.submissionId
		let userId = request.body.userId
		model.deleteReview(submissionId, userId, (error)=> {
			if(error) next(error)
			else response.send("Success!")
		})
	},

	confirmPerformerEmail: function(request, response, next) {
		let email = request.body.email
		model.confirmPerformerEmail(email, (error, isValid)=> {
			if(error) next(error)
			else {
		    response.header("Access-Control-Allow-Origin", "*")
		    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
				response.json({valid: isValid})
			}
		})
	}

}