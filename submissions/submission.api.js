const Submission = require('../submissions/submission.schema')

let submissionApi = {

	createSubmission: function(submission, callback) {
		let newSubmission = Submission(submission)
		newSubmission.save((error, submission)=> {
			if (error) throw Error("FUCK MAN")
			callback(error, submission)
		})
	},

	getSubmission: function(callback) {
		Submission.findById(objectId, (error, submission)=> {
			if(error) throw Error("FJLFS!!1")
			callback(submission)
		})
	},

	getAllSubmissions: function(callback) {
		Submission.find((error, submissions)=> {
			if (error) throw Error("OH MY GOD")
			callback(submissions)
		})
	},

	deleteSubmission: function(objectId, callback) {
		Submission.findById(objectId, (error, submission)=> {
			if (error) throw Error("NO THANKS")

			submission.remove((error, submission)=> {
				if (error) throw Error("AHH NO WAY")
				callback(submission)
			})
		})
	}
}

module.exports = submissionApi