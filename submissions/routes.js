const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/is-logged-in')
const isRole = require('../middleware/is-role')
const submissionModel = require('../submissions/model')
const limax = require('limax')
const sendEmail = require('../utilities/send-email')
const isProductionEnvironment = require('../utilities/is-production-environment')
const _ = require('lodash')


router.post('/finalize/:id', (request, response, next)=> {
	let id = request.params.id
	let newSubmissionData = request.body
	submissionModel.finalize(id, newSubmissionData, (error, savedSubmision)=> {
		if(error) next(error)
		else response.redirect('/submissions/accept/'+id)
	})
})

router.post('/reschedule/:id', (request, response, next)=> {
	let id = request.params.id
	let availability = request.body['available']
	submissionModel.reschedule(id, availability, (error, savedSubmision)=> {
		if(error) next(error)
		else response.redirect('/submissions/accept/'+id)
	})
})

router.get('/acts', isLoggedIn, (request, response, next)=> {
	submissionModel.getAllAccepted((error, acts)=> {
		if(error) next(error)
		else response.render('acts/view-all', {acts})
	})
})

router.get('/create-act', isLoggedIn, (request, response, next)=> {
	response.render('acts/create')
})

router.get('/act/:id', isLoggedIn, (request, response, next)=> {
	let id = request.params.id
	submissionModel.get(id, (error, acts)=> {
		if(error) next(error)
		else response.render('acts/view', {act})
	})
})

router.get('/accept/:id', (request, response, next)=> {
	let id = request.params.id
	submissionModel.get(id, (error, submission)=> {
		if(error) next(error)
		else {
			if(submission.showType === 'Stand-Up') response.render('accept/accept', {act: submission})
			else {
				let showModel = require('../shows/model')
				showModel.getAll((error, shows)=> {
					if(error) next(error)
					else {
						let dates = shows.filter(s=> s.acts.filter(a=> String(a._id) == String(submission._id)).length > 0)
            let days = ""
            if (dates.length > 0) {
              days = convertDay(dates[0].day)
  					  if(dates.length > 1) days += " and " + convertDay(dates[1].day)
            }
						response.render('accept/accept', {act: submission, days})
					}
				})
			}
		}
	})
})

function convertDay(day) {
	switch(day) {
		case "Monday": return "Monday, September 3rd"
		case "Tuesday": return "Tuesday, August 28th"
		case "Wednesday": return "Wednesday, August 29th"
		case "Thursday": return "Thursday, August 30th"
		case "Friday": return "Friday, August 31st"
		case "Saturday": return "Saturday, September 1st"
		case "Sunday": return "Sunday, September 2nd"
	}
}

router.post('/accept/:id', (request, response, next)=> {
	let id = request.params.id
	let confirmationStatus = request.body['confirmation-status']
	submissionModel.setConfirmationStatus(id, confirmationStatus, (error, savedSubmission)=> {
		if(error) next(error)
		else response.redirect(savedSubmission._id)
	})
})

router.get('/status', isLoggedIn, (request, response, next)=> {
	submissionModel.getAllPaid((error, submissions)=> {
		if(error) next(error)
		else response.render('accept/status', {submissions})
	})
})

router.get('/standardize', isLoggedIn, isRole(['staff']), (request, response, next)=> {
	response.render('submissions/standardize')
})

router.get('/stamp', isLoggedIn, isRole(['staff']), (request, response, next)=> {
	response.render('submissions/stamp')
})

router.get('/charts', isLoggedIn, isRole(['staff']), (request, response, next)=> {
	response.render('submissions/charts')
})

// GET /submissions
router.get('/', isLoggedIn, isRole(['staff']), (request, response, next)=> {

	submissionModel.getAllPaid((error, submissions)=> {
		if(error) next(error)
		else {
			let totalSubmissions = submissions.length

			let totalReviewsCount = 0
			let reviewedSubmissionCount = 0
			let completedSubmissionCount = 0

			let demographics = {improv:0, sketch:0, standup:0, variety:0, podcast:0, performer:0, other:0}
			let hometowns = {}
			let theaters = []
			let reviewers = []
			let reviews = {}
			let reviewCount = [0,0,0,0,0,0,0]

			for(let i=0; i<submissions.length; i++) {

				// REVIEWS
				totalReviewsCount+= submissions[i].reviews.length				
				if(submissions[i].reviews.length > 0)
					reviewedSubmissionCount++
				if(submissions[i].reviews.length >= 5)
					completedSubmissionCount++

				// REVIEWS (but detailed)
				let numberOfReviews = submissions[i].reviews.length
				if(numberOfReviews <= 5) reviewCount[numberOfReviews]++
				else reviewCount[6]++

				switch(submissions[i].reviews.length) {
					case 0: reviewCount[0]++; break;
					case 1: reviewCount[1]++; break;
					case 2: reviewCount[2]++; break;
					case 3: reviewCount[3]++; break;
					case 4: reviewCount[4]++; break;
					case 5: reviewCount[5]++; break;
					default: 
				}

				// SHOW TYPES
				switch(submissions[i].showType) {
					case "Improv": 		demographics.improv++; 	break;
					case "Sketch": 		demographics.sketch++; 	break;
					case "Stand-Up": 	demographics.standup++; break;
					case "Variety": 	demographics.variety++; break;
					case "Podcast": 	demographics.podcast++;	break;
					case "Individual": 	demographics.performer++; break;
					case "Music": 		demographics.music++; break;
					case "Other": 		demographics.other++;	break;
				}

				// CITY DEMOGRAPHICS
				let hometown = submissions[i].city + ", " + submissions[i].state
				if(hometown in hometowns) hometowns[hometown]++
				else hometowns[hometown] = 1

				// THEATERS
				theaters = theaters.concat(submissions[i].homeTheater)

				// REVIEWERS
				for(let j=0; j<submissions[i].reviews.length; j++) {
					let reviewer = submissions[i].reviews[j].username
					if (!(reviewer in reviewers)) reviewers.push(reviewer)
					if (typeof(reviews[reviewer]) == 'undefined')
						reviews[reviewer] = []
					reviews[reviewer].push({
						act: submissions[i].actName,
						score: submissions[i].reviews[j].score
					})
				}
			}

			// REVIEWS
			let percentReviewed = (reviewedSubmissionCount / totalSubmissions * 100).toFixed(0)
			let percentComplete = (completedSubmissionCount / totalSubmissions * 100).toFixed(0)

			// Filter out count <= 1
			let filteredHometownNames = Object.keys(hometowns)
				.filter(hometown=> (hometowns[hometown] > 1))
				
			let filteredHometownCounts = filteredHometownNames
				.map(ht=> hometowns[ht])

			let hometownCounts = Object.keys(hometowns).map(ht=> hometowns[ht])

			// THEATERS
			let theatery = _.countBy(theaters)
			let theateryFiltered = _.pickBy(theatery, (value, key)=> {return (value>1)})

			let performers = []
			for(let i=0; i<submissions.length; i++) {
				performers.push({
					performerName: submissions[i].primaryContactName, 
					actName: submissions[i].actName,
					role: submissions[i].primaryContactRole,
					actType: submissions[i].showType,
					location: submissions[i].city + ", " + submissions[i].state
				})
				for(let j=0; j<submissions[i].additionalMembers.length; j++) {
					performers.push({
						performerName: submissions[i].additionalMembers[j].name,
						actName: submissions[i].actName,
						role: submissions[i].additionalMembers[j].role,
						actType: submissions[i].showType,
						location: submissions[i].city + ", " + submissions[i].state
					})
				}
			}

			response.render('submissions/view-all', {
				submissions: submissions, 
				performers: performers,
				percentReviewed: percentReviewed,
				percentComplete: percentComplete,
				totalReviewsCount: totalReviewsCount,
				reviewedSubmissionCount: reviewedSubmissionCount,
				completedSubmissionCount: completedSubmissionCount,
				demographics: demographics,
				hometownNames: Object.keys(hometowns),
				hometownCounts: hometownCounts,
				filteredHometownNames: filteredHometownNames,
				filteredHometownCounts: filteredHometownCounts,
				theaters: theatery,
				theatersFiltered: theateryFiltered,
				reviews: reviews,
				reviewCount: reviewCount
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

router.get('/submission/:domain', isLoggedIn, isRole(['staff']), (request, response, next)=> {
	let domain = request.params.domain
	submissionModel.getByDomain(domain, (error, submission)=> {
		if(error) next(error)
		else response.render('submissions/view', {submission: submission})
	})
})

router.get('/create', isLoggedIn, isRole(['staff']), (request, response, next)=> {
	response.render('submissions/create')
})

router.post('/create', isLoggedIn, isRole(['staff']), (request, response, next)=> {

	let submission = formatSubmissionObject(request)

	// Assumes: Paid, Accepted and Confirmed
	submission.paymentInfo = true
	submission.stamp = 'in'
	submission.confirmationStatus = 'yes'

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

	let callback = function(error, submissions, votes) {
		if(error) next(error)
		else {
			let username = request.user.username
			let votes = getVotes(submissions, username)
			response.render('submissions/review-submissions', {submissions: submissions, votes: votes})
		}
	}

	// Behavior depends on role
	let userRoles = request.user.roles


	if (userRoles.includes('staff') || userRoles.includes('admin')) {
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

function getVotes(submissions, username) {
	let releventSubmissions = []
	let votes = {yes:0, meh:0, nah:0, veto:0}
	for(let i=0; i<submissions.length; i++) {
		for(let j=0; j<submissions[i].reviews.length; j++) {
			if (submissions[i].reviews[j].username === username) {
				releventSubmissions.push(submissions[i])
				switch(submissions[i].reviews[j].score) {
					case  2: votes.yes++;  break;
					case  1: votes.meh++;  break;
					case  0: votes.nah++;  break;
					case -1: votes.veto++; break;
				}
			}
		}
	}
	return votes
}

router.get('/review/:objectId', isLoggedIn, isRole(['staff', 'panelist', 'standup-panelist']), (request, response, next)=> {
	let objectId = request.params.objectId
	submissionModel.get(objectId, (error, submission)=> {
		if(error) next(error)
		else response.render('submissions/review-submission', {submission: submission})
	})
})

router.post('/review/:objectId', isLoggedIn, isRole(['staff', 'panelist', 'standup-panelist']), (request, response, next)=> {
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

router.get('/review2', isLoggedIn, isRole(['panelist']), (request, response, next)=> {
	response.render('submissions/review-submissions2')
})

router.get('/reviews/:domain', isLoggedIn, isRole(['staff']), (request, response, next)=> {
	let domain = request.params.domain
	submissionModel.getByDomain(domain, (error, submission)=> {
		if(error) next(error)
		else response.render('submissions/reviews-by-submission', {submission: submission})
	})
})

router.get('/reviews-by-user/:username', isLoggedIn, isRole(['staff']), (request, response, next)=> {
	let username = request.params.username
	submissionModel.getAll((error, submissions)=> {
		if(error) next(error)
		else {
			let releventSubmissions = []
			let votes = {yes:0, meh:0, nah:0, veto:0}
			for(let i=0; i<submissions.length; i++) {
				for(let j=0; j<submissions[i].reviews.length; j++) {
					if (submissions[i].reviews[j].username === username) {
						releventSubmissions.push(submissions[i])
						switch(submissions[i].reviews[j].score) {
							case  2: votes.yes++;  break;
							case  1: votes.meh++;  break;
							case  0: votes.nah++;  break;
							case -1: votes.veto++; break;
						}
					}
				}
			}
			response.render('submissions/reviews-by-user', {submissions: releventSubmissions, username: username, votes: votes})
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
				//sendEmail(process.env.SUBMISSION_EMAIL, 'OoB | Application Updated | ' + newSubmission.actName, archiveMessage)
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