const Submission = require('../submissions/submission.schema')

let submissionApi = {

	createSubmission: function(submission, callback) {
		let newSubmission = Submission(submission)
		this.saveSubmission(newSubmission, (savedSubmission)=> {
			callback(savedSubmission)
		})
	},

	saveSubmission: function(submission, callback) {
		submission.save((error, submission)=> {
			if (error) throw Error("Failed to save submission")
			callback(submission)
		})
	},

	getSubmission: function(objectId, callback) {
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

	updateSubmission: function(updatedSubmission, callback) {
		this.getSubmission(submission.id, (submission)=> {

			submission.actName = updatedSubmission.actName
			//etc...
			
			this.saveSubmission(submission, (savedSubmission)=> {
				callback(savedSubmission)
			})
		})
	},

	updateSubmissionImage: function(objectId, imageUrl, deleteImageUrl, callback) {
		this.getSubmission(objectId, (submission)=> {

			submission.imageUrl = imageUrl
			submission.deleteImageUrl = deleteImageUrl
			
			this.saveSubmission(submission, (savedSubmission)=> {
				callback(savedSubmission)
			})
		})
	},

	deleteSubmission: function(objectId, callback) {
		this.getSubmission(objectId, (submission)=> {
			submission.remove((error, submission)=> {
				if (error) throw Error("AHH NO WAY")
				callback(submission)
			})
		})
	}
}

module.exports = submissionApi