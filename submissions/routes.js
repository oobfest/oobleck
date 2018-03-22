const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/is-logged-in')
const isRole = require('../middleware/is-role')
const submissionModel = require('../submissions/model')
const limax = require('limax')
const sendEmail = require('../utilities/send-email')
const isProductionEnvironment = require('../utilities/is-production-environment')

// GET /submissions
router.get('/', isLoggedIn, isRole(['admin', 'schedule']), (request, response, next)=> {

	submissionModel.getAllPaid((error, submissions)=> {
		if(error) next(error)
		else {
			let totalSubmissions = submissions.length

			let totalReviewsCount = 0
			let reviewedSubmissionCount = 0
			let completedSubmissionCount = 0

			for(let i=0; i<submissions.length; i++) {
				totalReviewsCount+= submissions[i].reviews.length				
				if(submissions[i].reviews.length > 0)
					reviewedSubmissionCount++
				if(submissions[i].reviews.length >= 5)
					completedSubmissionCount++
			}

			let percentReviewed = (reviewedSubmissionCount / totalSubmissions * 100).toFixed(0)
			let percentComplete = (completedSubmissionCount / totalSubmissions * 100).toFixed(0)

			response.render('submissions/view-all', {
				submissions: submissions, 
				percentReviewed: percentReviewed,
				percentComplete: percentComplete,
				totalReviewsCount: totalReviewsCount,
				reviewedSubmissionCount: reviewedSubmissionCount,
				completedSubmissionCount: completedSubmissionCount
			})
		}
	})
})

router.get('/unpaid', isLoggedIn, isRole(['admin']), (request, response, next)=> {
	submissionModel.getAllUnpaid((error, submissions)=> {
		if(error) next(error)
		else response.render('submissions/view-all-unpaid', {submissions: submissions})
	})
})

router.get('/submission/:domain', isLoggedIn, isRole(['admin', 'schedule']), (request, response, next)=> {
	let domain = request.params.domain
	submissionModel.getByDomain(domain, (error, submission)=> {
		if(error) next(error)
		else response.render('submissions/view', {submission: submission})
	})
})

router.get('/create', isLoggedIn, isRole(['admin', 'schedule']), (request, response, next)=> {
	response.render('submissions/create')
})

router.post('/create', isLoggedIn, isRole(['admin', 'schedule']), (request, response, next)=> {

	let submission = formatSubmissionObject(request)
	submission.paymentInfo = true

	submissionModel.create(submission, (error, savedSubmission)=> {
		if(error) next(error)
		else response.redirect('/submissions/submission/' + savedSubmission.domain)
	})
})

router.get('/delete/:objectId', isRole(['admin']), (request, response)=> {
	let objectId = request.params.objectId
	submissionModel.delete(objectId, (error)=> {
		if(error) next(error)
		else {
			response.redirect('/submissions')			
		}
	})
})

router.post('/delete-image/:objectId', (request, response)=> {
	let objectId = request.params.objectId
	submissionModel.updateImage(objectId, null, null, ()=> {
		response.send({message: "Borat Voice: 'Great success!'"})
	})
})

router.post('/add-image/:objectId', (request, response)=> {
	let objectId = request.params.objectId
	let imageUrl = request.body['image-url']
	let deleteImageUrl = request.body['delete-image-url']
	submissionModel.updateImage(objectId, imageUrl, deleteImageUrl, ()=> {
		response.send({message: "Borat Voice: 'Very nice!'"})
	})
})

router.get('/review', isLoggedIn, (request, response, next)=> {

	let callback = function(error, submissions) {
		if(error) next(error)
		else response.render('submissions/review-submissions', {submissions: submissions})
	}

	// Behavior depends on role
	let userRoles = request.user.roles

	if (userRoles.includes('schedule')) {
		submissionModel.getAllPaid((error, submissions)=> {
			callback(error, submissions)
		})
	}
	else if (userRoles.includes('panelist')) {
		submissionModel.getAllPaidExceptStandup((error, submissions)=> {
			callback(error, submissions)
		})		
	}
	else if (userRoles.includes('standup-panelist')) {
		submissionModel.getAllPaidStandup((error, submissions)=> {
			callback(error, submissions)
		})
	}
	else {
		next(new Error("You do not have permission to do that :("))
	}
})

router.get('/review/:objectId', isLoggedIn, isRole(['admin', 'schedule', 'panelist', 'standup-panelist']), (request, response, next)=> {
	let objectId = request.params.objectId
	submissionModel.get(objectId, (error, submission)=> {
		if(error) next(error)
		else response.render('submissions/review-submission', {submission: submission})
	})
})

router.post('/review/:objectId', isLoggedIn, isRole(['admin', 'schedule', 'panelist', 'standup-panelist']), (request, response, next)=> {
	let objectId = request.params.objectId
	let review = {
		userId: request.user._id,
		username: request.user.username,
		score: request.body['score'],
		notes: request.body['notes']
	}
	submissionModel.saveReview(objectId, review, (error, submission)=> {
		if(error) next(error)
		else response.redirect('/submissions/review')
	})
})

router.get('/reviews/:domain', isLoggedIn, isRole(['admin', 'schedule']), (request, response, next)=> {
	let domain = request.params.domain
	submissionModel.getByDomain(domain, (error, submission)=> {
		if(error) next(error)
		else response.render('submissions/reviews-by-submission', {submission: submission})
	})
})

router.get('/reviews-by-user/:username', isLoggedIn, isRole(['admin', 'schedule']), (request, response, next)=> {
	let username = request.params.username
	submissionModel.getAll((error, submissions)=> {
		if(error) next(error)
		else {
			let releventSubmissions = []
			for(let i=0; i<submissions.length; i++)
				for(let j=0; j<submissions[i].reviews.length; j++)
					if (submissions[i].reviews[j].username === username)
						releventSubmissions.push(submissions[i])
			response.render('submissions/reviews-by-user', {submissions: releventSubmissions, username: username})
		}
	})
})

// Normally this path would be restricted by roles & signed-in users,
// It's kept public so troup members can edit the form
router.get('/edit/:objectId', (request, response, next)=> {
	let objectId = request.params.objectId
	submissionModel.get(objectId, (error, submission)=> {
		if(error) next(error)
		else {
			let imgurUrlConverter = require('../utilities/imgur')
			response.render('submissions/edit', {submission: submission, user: request.user})
		}
	})
})

router.post('/edit', (request, response, next)=> {

	let submission = formatSubmissionObject(request)

	submissionModel.update(submission, (error, newSubmission)=> {
		if(error) next(error)
		else {			
			if(isProductionEnvironment) {
				let archiveMessage = 
					`<b>Act name:</b> 		${newSubmission.actName}<br>` +
					`<b>Type:</b> 			${newSubmission.showType}<br>` + 
					`<b>Bio:</b>  			${newSubmission.publicDescription}<br>` + 
					`<b>Description:</b>  	${newSubmission.informalDescription}<br>` +
					`<b>Hometown:</b> 		${newSubmission.homeTheater ? newSubmission.homeTheater + ' in' : ''} ${newSubmission.city}, ${newSubmission.state}, ${newSubmission.country}<br>` +
					`<b>Contact:</b>  		${newSubmission.primaryContactName}, ${newSubmission.primaryContactEmail}<br>` +
					`<b>Image URL:</b>		${newSubmission.imageUrl ? newSubmission.imageUrl : 'No image uploaded'}<br>` +
					`<b>Availability:</b> 	${newSubmission.available.join(' ')}<br>` + 
					`<b>Video URLs:</b><br>	${newSubmission.videoUrls.join('<br>')}`
				sendEmail(process.env.SUBMISSION_EMAIL, 'OoB | Application Updated | ' + newSubmission.actName, archiveMessage)
			}
			response.redirect('/submissions/edit/' + submission.id)
		}
	})
})

function formatSubmissionObject(request) {
	return { 
		id: request.body['submission-id'],
		actName: request.body['act-name'],
		domain: limax(request.body['act-name']),
		showType: request.body['show-type'],
		informalDescription: request.body['informal-description'],
		publicDescription: request.body['public-description'],
		accolades: request.body['accolades'],
		country: request.body['country'],
		city: request.body['city'],
		state: request.body['state'],
		homeTheater: request.body['home-theater'],
		primaryContactName: request.body['primary-contact-name'],
		primaryContactEmail: request.body['primary-contact-email'],
		primaryContactPhone: request.body['primary-contact-phone'],
		primaryContactRole: request.body['primary-contact-role'],
		primaryContactAttending: (request.body['primary-contact-attending'].toLowerCase() == 'yes'),
		minimumShowLength: request.body['minimum-show-length'],
		maximumShowLength: request.body['maximum-show-length'],
		specialNeeds: request.body['special-needs'],
		imageUrl: request.body['image-url'],
		deleteImageUrl: request.body['delete-image-url'],
		videoUrls: [
			request.body['video-url-0'],
			request.body['video-url-1'],
			request.body['video-url-2']
		],
		videoInfo: request.body['video-info'],
		available: request.body['available'],
		conflicts: flattenConflicts(
			request.body['conflict-act'],
			request.body['conflict-person']
		),

		additionalMembers: flattenPersonnel(
			request.body['personnel-name'], 
			request.body['personnel-email'], 
			request.body['personnel-role'],
			request.body['personnel-attending']
		),

		socialMedia: flattenSocialMedia(
			request.body['social-media-type'],
			request.body['social-media-url']
		)
	}
}

function flattenSocialMedia(socialMediaTypes, socialMediaUrls) {
	if (socialMediaTypes) {
		let socialMedia = []
		for(let i=0; i<socialMediaTypes.length; i++) {
			socialMedia.push({
				type: socialMediaTypes[i],
				url: socialMediaUrls[i]
			})
		}
		return socialMedia
	}
	return []
}

function flattenPersonnel(personnelNames, personnelEmails, personnelRoles, personnelAttending) {
	if(personnelNames) {
		let personnel = []
		for(let i=0; i<personnelNames.length; i++) {
			personnel.push({
				name: personnelNames[i],
				email: personnelEmails[i],
				role: personnelRoles[i],
				attending: (personnelAttending[i].toLowerCase() == 'yes')
			})
		}
		return personnel
	}
	return []
}

function flattenConflicts(conflictActs, conflictPersons) {
	if(conflictActs) {
		let conflicts = []
		for(let i=0; i<conflictActs.length; i++) {
			conflicts.push({
				act: conflictActs[i],
				person: conflictPersons[i]
			})
		}
		return conflicts
	}
	return []
}

module.exports = router