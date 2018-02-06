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
		this.getSubmission(updatedSubmission.id, (oldSubmission)=> {

			oldSubmission.actName				= updatedSubmission.actName,
  			oldSubmission.domain				= updatedSubmission.domain,
  			oldSubmission.showType				= updatedSubmission.showType,
  			oldSubmission.informalDescription	= updatedSubmission.informalDescription,
  			oldSubmission.publicDescription		= updatedSubmission.publicDescription,
  			oldSubmission.accolades				= updatedSubmission.accolades,
  			oldSubmission.country				= updatedSubmission.country,
  			oldSubmission.city					= updatedSubmission.city,
  			oldSubmission.state					= updatedSubmission.state,
  			oldSubmission.homeTheater			= updatedSubmission.homeTheater
  			oldSubmission.primaryContactName	= updatedSubmission.primaryContactName,
  			oldSubmission.primaryContactEmail	= updatedSubmission.primaryContactEmail,
  			oldSubmission.primaryContactPhone	= updatedSubmission.primaryContactPhone,
  			oldSubmission.primaryContactRole	= updatedSubmission.primaryContactRole,
  			oldSubmission.additionalMembers		= updatedSubmission.additionalMembers,
  			oldSubmission.showLength			= updatedSubmission.showLength,
  			oldSubmission.specialNeeds			= updatedSubmission.specialNeeds,
  			oldSubmission.imageUrl				= updatedSubmission.imageUrl,
  			oldSubmission.deleteImageUrl		= updatedSubmission.deleteImageUrl,
  			oldSubmission.videoUrl				= updatedSubmission.videoUrl
  			oldSubmission.videoInfo				= updatedSubmission.videoInfo
  			oldSubmission.socialMedia			= updatedSubmission.socialMedia,
  			oldSubmission.available				= updatedSubmission.available,
  			oldSubmission.conflicts				= updatedSubmission.conflicts,
			
			this.saveSubmission(oldSubmission, (savedSubmission)=> {
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

	updatePayment: function(objectId, paymentInfo, callback) {
		this.getSubmission(objectId, (submission)=> {

			submission.paymentInfo = paymentInfo
			submission.markModified('paymentInfo')
			
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