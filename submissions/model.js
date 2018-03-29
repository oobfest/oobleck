const _ = require('lodash')
const Submission = require('../submissions/schema')

module.exports = {

	create: function(submission, callback) {
		let newSubmission = Submission(submission)
		this.save(newSubmission, (error, savedSubmission)=> {
			callback(error, savedSubmission)
		})
	},

	save: function(submission, callback) {
		submission.save((error, savedSubmission)=> {
			callback(error, savedSubmission)
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

	getAllPaid: function(callback) {
		Submission.find({paymentInfo: {$ne: null}}, (error, submissions)=> {
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

	getAllUnpaid: function(callback) {
		Submission.find({paymentInfo: null}, (error, submissions)=> {
			callback(error, submissions)
		})
	},

	saveReview: function(objectId, newReview, callback) {
		this.get(objectId, (error, submission)=> {
			if(error) callback(error)
			else {
				// Update the review if it already exists
				reviewIndex = submission.reviews.findIndex(review => review.userId == newReview.userId)
				if (reviewIndex === -1) submission.reviews.push(newReview)
				else submission.reviews[reviewIndex] = newReview
				this.save(submission, (error, savedSubmission)=> {
					callback(error, savedSubmission)
				})

			}
		})
	},

	addTheaterTag: function(objectId, tag, callback) {
		this.get(objectId, (error, submission)=> {
			if(error) callback(error)
			else {
				if(!submission.theaterTags.includes(tag)) {
					submission.theaterTags.push(tag)
					this.save(submission, (error, savedSubmission)=> {
						callback(error, savedSubmission)
					})					
				}
				else callback()
			}
		})
	},

	removeTheaterTag: function(objectId, tag, callback) {
		this.get(objectId, (error, submission)=> {
			if(error) callback(error)
			else {
				submission.update({$pull: {theaterTags: tag}}, (error, response)=> {
					callback(error, response)
				})
			}
		})
	},

	update: function(update, callback) {
		this.get(update.id, (error, submission)=> {
			if(error) callback(error)
			else {
				_.merge(submission, update)
				this.save(submission, (error, savedSubmission)=> {
					callback(error, savedSubmission)
				})
			}
		})
	},

	updateImage: function(objectId, imageUrl, deleteImageUrl, callback) {
		this.get(objectId, (error, submission)=> {
			if(error) callback(error)
			else {
				submission.imageUrl = imageUrl
				submission.deleteImageUrl = deleteImageUrl
				this.save(submission, (error, savedSubmission)=> {
					callback(error, savedSubmission)
				})				
			}
		})
	},

	updatePayment: function(objectId, paymentInfo, callback) {
		this.get(objectId, (error, submission)=> {

			submission.paymentInfo = paymentInfo
			submission.markModified('paymentInfo')
			
			this.save(submission, (error, savedSubmission)=> {
				callback(error, savedSubmission)
			})
		})
	},

	delete: function(objectId, callback) {
		this.get(objectId, (error, submission)=> {
			if(error) callback(error)
			else {			
				submission.remove((error)=> {
					callback(error)
				})
			}
		})
	}
}