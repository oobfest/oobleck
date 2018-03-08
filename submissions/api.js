const Submission = require('../submissions/schema')

let submissionApi = {

	create: function(submission, callback) {
		let newSubmission = Submission(submission)
		this.save(newSubmission, (savedSubmission)=> {
			callback(savedSubmission)
		})
	},

	save: function(submission, callback) {
		submission.save((error, submission)=> {
			if (error) throw Error("Failed to save submission")
			callback(submission)
		})
	},

	get: function(objectId, callback) {
		Submission.findById(objectId, (error, submission)=> {
			callback(error, submission)
		})
	},

	getByDomain: function(domain, callback) {
		Submission.findOne({domain: domain}, (error, submission)=> {
			callback(error, submission)
		})
	},

	getAll: function(callback) {
		Submission.find((error, submissions)=> {
			callback(error, submissions)
		})
	},

	getAllPaidExceptStandup: function(callback) {
		Submission.find({showType: {$ne: 'Stand-Up'}, paymentInfo: {$ne: null} }, (error, submissions)=> {
			callback(error, submissions)
		})
	},

	getAllPaidStandup: function(callback) {
		Submission.find({showType: 'Stand-Up', paymentInfo: {$ne: null} }, (error, submissions)=> {
			callback(error, submissions)
		})
	},

	saveReview: function(objectId, newReview, callback) {
		this.get(objectId, (submission)=> {

			// Update the review if it already exists
			reviewIndex = submission.reviews.findIndex(review => review.userId == newReview.userId)
			if (reviewIndex === -1) submission.reviews.push(newReview)
			else submission.reviews[reviewIndex] = newReview

			this.save(submission, (savedSubmission)=> {
				callback(savedSubmission)
			})
		})
	},

	update: function(updatedSubmission, callback) {
		this.get(updatedSubmission.id, (oldSubmission)=> {

			oldSubmission.actName					= updatedSubmission.actName,
  			oldSubmission.domain					= updatedSubmission.domain,
  			oldSubmission.showType					= updatedSubmission.showType,
  			oldSubmission.informalDescription		= updatedSubmission.informalDescription,
  			oldSubmission.publicDescription			= updatedSubmission.publicDescription,
  			oldSubmission.accolades					= updatedSubmission.accolades,
  			oldSubmission.country					= updatedSubmission.country,
  			oldSubmission.city						= updatedSubmission.city,
  			oldSubmission.state						= updatedSubmission.state,
  			oldSubmission.homeTheater				= updatedSubmission.homeTheater
  			oldSubmission.primaryContactName		= updatedSubmission.primaryContactName,
  			oldSubmission.primaryContactEmail		= updatedSubmission.primaryContactEmail,
  			oldSubmission.primaryContactPhone		= updatedSubmission.primaryContactPhone,
  			oldSubmission.primaryContactRole		= updatedSubmission.primaryContactRole,
  			oldSubmission.primaryContactAttending 	= updatedSubmission.primaryContactAttending,
  			oldSubmission.additionalMembers			= updatedSubmission.additionalMembers,
  			oldSubmission.minimumShowLength			= updatedSubmission.minimumShowLength,
  			oldSubmission.maximumShowLength			= updatedSubmission.maximumShowLength,
  			oldSubmission.specialNeeds				= updatedSubmission.specialNeeds,
  			oldSubmission.noFood					= updatedSubmission.noFood,
  			oldSubmission.imageUrl					= updatedSubmission.imageUrl,
  			oldSubmission.deleteImageUrl			= updatedSubmission.deleteImageUrl,
  			oldSubmission.videoUrls					= updatedSubmission.videoUrls,
  			oldSubmission.videoInfo					= updatedSubmission.videoInfo
  			oldSubmission.socialMedia				= updatedSubmission.socialMedia,
  			oldSubmission.available					= updatedSubmission.available,
  			oldSubmission.conflicts					= updatedSubmission.conflicts,
			
			this.save(oldSubmission, (savedSubmission)=> {
				callback(savedSubmission)
			})
		})
	},

	updateImage: function(objectId, imageUrl, deleteImageUrl, callback) {
		this.get(objectId, (submission)=> {

			submission.imageUrl = imageUrl
			submission.deleteImageUrl = deleteImageUrl
			
			this.save(submission, (savedSubmission)=> {
				callback(savedSubmission)
			})
		})
	},

	updatePayment: function(objectId, paymentInfo, callback) {
		this.get(objectId, (submission)=> {

			submission.paymentInfo = paymentInfo
			submission.markModified('paymentInfo')
			
			this.save(submission, (savedSubmission)=> {
				callback(savedSubmission)
			})
		})
	},

	delete: function(objectId, callback) {
		this.get(objectId, (submission)=> {
			submission.remove((error, submission)=> {
				if (error) throw Error("AHH NO WAY")
				callback(submission)
			})
		})
	}
}

module.exports = submissionApi