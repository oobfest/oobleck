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

  getActByDomain: function(domain, callback) {
    Submission.findOne({domain: domain}, (error, submission)=> {
      if(error) callback(error, null)
      else {
        // Hide plz
        if(submission.reviews) submission.reviews = []
        callback(null, submission)
      }
    })
  },

	getAll: function(callback) {
		Submission.find((error, submissions)=> {
			callback(error, submissions)
		})
	},

	getAllPaid: (callback)=> {
		Submission.find({paymentInfo: {$ne: null}}, (error, submissions)=> {
			callback(error, submissions)
		})
	},

	getAllAccepted: function(callback) {
		Submission.find({stamp: 'in'}, (error, submissions)=> {
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

  getValidActs: function(callback) {
    Submission.find({stamp: 'in', confirmationStatus: 'yes', imageUrl: { $nin: [null, undefined, ''] }}, (error, acts)=> {
      callback(error, acts)
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

	deleteReview: function(submissionId, userId, callback) {
		this.get(submissionId, (error, submission)=> {
			if(error) callback(error)
			else {
				reviewIndex = submission.reviews.findIndex(review => review.userId == userId)
				submission.update({$pull: {reviews: {userId: userId}}}, (error, response)=> {
					callback(error, response)
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
				submission.markModified('videoUrls')
				submission.markModified('availability')
				submission.markModified('conflicts')
				submission.markModified('additionalMembers')
				submission.markModified('socialMedia')
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

	standardize: function(objectId, city, state, theater, callback) {
		this.get(objectId, (error, submission)=> {
			if(error) callback(error)
			else {
				submission.city = city
				submission.state = state
				submission.homeTheater = theater
				this.save(submission, (error, savedSubmission)=> {
					callback(error, savedSubmission)
				})				
			}
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
	},

	stamp: function(objectId, stamp, callback) {
		this.get(objectId, (error, submission)=> {
			if(error) callback(error)
			else {
				submission.stamp = stamp
				this.save(submission, (error, savedSubmission)=> {
					callback(error, savedSubmission)
				})
			}
		})
	},

	stampAccept: function(objectId, callback) {
		this.stamp(objectId, 'in', callback)
	},

	stampPurgatory: function(objectId, callback) {
		this.stamp(objectId, undefined, callback)
	},

	stampReject: function(objectId, callback) {
		this.stamp(objectId, 'out', callback)
	},

	addNote: function(objectId, note, callback) {
		this.get(objectId, (error, submission)=> {
			if(error) callback(error)
			else {
				submission.scheduleNotes = note
				this.save(submission, (error, savedSubmission)=> {
					callback(error, savedSubmission)
				})
			}
		})
	},

	setConfirmationStatus: function(objectId, confirmationStatus, callback) {
		this.get(objectId, (error, submission)=> {
			if(error) callback(error)
			else {
				confirmationStatus == 'cancel'
					? submission.confirmationStatus = null
					: submission.confirmationStatus = confirmationStatus
				this.save(submission, (error, savedSubmission)=> {
					callback(error, savedSubmission)
				})
			}
		})
	},

	// Weird esoteric update method
	finalize: function(objectId, newSubmissionData, callback) {
		this.get(objectId, (error, submission)=> {
			if(error) callback(error)
			else {
				submission.available = newSubmissionData.available
				submission.bonusShows = newSubmissionData.bonusShows
				submission.workshop = newSubmissionData.workshop
				submission.techRehearsalNeeded = newSubmissionData.techRehearsalNeeded === 'yes' ? true : false
				this.save(submission, (error, savedSubmission)=> {
					callback(error, savedSubmission)
				})
			}
		})
	},

	// Just the dates, plz
	reschedule: function(objectId, availability, callback) {
		this.get(objectId, (error, submission)=> {
			if(error) callback(error)
			else {
				submission.available = availability
				this.save(submission, (error, savedSubmission)=> {
					callback(error, savedSubmission)
				})
			}
		})
	}

}