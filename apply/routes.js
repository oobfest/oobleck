const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator/check')
const submissionValidation = require('../submissions/validation')
const submissionModel = require('../submissions/model')
const limax = require('limax')
const log = require('winston')
const sendEmail = require('../utilities/send-email')
const isNotARobot = require('../middleware/is-not-a-robot')

// GET /apply
router.get('/', (request, response) => {
	response.render('apply/first-page', { 
		recaptcha: true, 
		hotjar: true,
		trackPage: true,
		submission: {available: []}, 
		socialMedia: [], 
		personnel: []
	})
})

// GET /apply/hosting
router.get('/hosting', (request, response)=> {
	response.render('apply/host-application', { 
		recaptcha: true, 
		hotjar: true, 
		trackPage: true 
	})
})

// POST /apply
// From first page to second page
router.post('/', isNotARobot, submissionValidation, (request, response, next) => {

	let submission = request.body
	delete submission['g-recaptcha-response']

	if(typeof submission.available === 'undefined')
		submission.available == []

	// Check for validation errors
	let errors = validationResult(request)
	let submissionIsErrorFree = errors.isEmpty()
	if (submissionIsErrorFree) {
		saveSubmission(submission, function(error, savedSubmission) {
			if(error) next(error)
			else {
				let applicationFee = calculateApplicationFee(savedSubmission)
				response.render('apply/second-page', {submission: savedSubmission, applicationFee: applicationFee, trackPage: true})				
			}
		})
	}
	else {
		response.render('apply/first-page', {
			recaptcha: true,
			errors: errors.array(),
			socialMedia: flattenSocialMedia(
				request.body['social-media-type'], 
				request.body['social-media-url']
			),
			personnel: flattenPersonnel(
				request.body['personnel-name'], 
				request.body['personnel-email'], 
				request.body['personnel-role'],
				request.body['personnel-attending']
			),
			conflicts: flattenConflicts(
				request.body['conflict-act'],
				request.body['conflict-person']
			),
			submission: request.body
		})	
	}
})

router.post('/pay/:objectId', (request, response)=> {
	let objectId = request.params.objectId
	let paymentInfo = request.body.paymentInfo
	submissionModel.updatePayment(objectId, paymentInfo, (submission)=> {
		response.send({'cool-message': "YAY!"})
	})
})

router.post('/finish', (request, response, next)=>{
	let objectId = request.body['id']
	let imageUrl = request.body['image-url']
	let deleteImageUrl = request.body['delete-image-url']
	submissionModel.updateImage(objectId, imageUrl, deleteImageUrl, (error, submission)=> {
		if(error) next(error)
		else {
			// Double-check that they payed (if in production)
			let isProduction = process.env.NODE_ENV == 'production'

			if(!isProduction) {
				response.render('apply/thank-you', {submission: submission, trackPage: true})
			}
			else if (submission.paymentInfo !== null) {
				let subject = "Thank you for applying to Out of Bounds 2018!"
				let message = 
					`We received your application for ${submission.actName}<br>` +
					`Acceptance emails will be sent out in the beginning of July<br>` + 
					`To view & edit your application, please use this URL: https://${request.hostname}/submissions/edit/${submission._id}<br>` +
					`Anyone with this URL can edit your application, so keep it safe!!`
				sendEmail(submission.primaryContactEmail, subject, message, (email)=> {
					response.render('apply/thank-you', {submission: submission, trackPage: true})
				})

				let archiveMessage = 
					`<b>Act name:</b> 		${submission.actName}<br>` +
					`<b>Type:</b> 			${submission.showType}<br>` + 
					`<b>Bio:</b>  			${submission.publicDescription}<br>` + 
					`<b>Description:</b>  	${submission.informalDescription}<br>` +
					`<b>Hometown:</b> 		${submission.homeTheater ? submission.homeTheater + ' in' : ''} ${submission.city}, ${submission.state}, ${submission.country}<br>` +
					`<b>Contact:</b>  		${submission.primaryContactName}, ${submission.primaryContactEmail}<br>` +
					`<b>Image URL:</b>		${submission.imageUrl ? submission.imageUrl : 'No image uploaded'}<br>` +
					`<b>Availability:</b> 	${submission.available.join(' ')}<br>` + 
					`<b>Video URLs:</b><br>	${submission.videoUrls.join('<br>')}`
				sendEmail(process.env.SUBMISSION_EMAIL, 'OoB | New Application | ' + submission.actName, archiveMessage)

			}
			else {
				response.render('apply/second-page', {trackPage: true, submission: submission, errors: [ {msg: "Something went wrong with the payment. Contact admin@oobfest.com if necessary!"}]})
			}			
		}
	})
})

function saveSubmission(submissionRequest, callback) {

	let submission = { 

		// Act Details
		actName: submissionRequest['act-name'],
		domain: limax(submissionRequest['act-name']),
		showType: submissionRequest['show-type'],
		informalDescription: submissionRequest['informal-description'],
		publicDescription: submissionRequest['public-description'],
		accolades: submissionRequest['accolades'],

		// Location
		country: submissionRequest['country'],
		city: submissionRequest['city'],
		state: submissionRequest['state'],
		homeTheater: submissionRequest['home-theater'],

		// Personnel
		primaryContactName: submissionRequest['primary-contact-name'],
		primaryContactEmail: submissionRequest['primary-contact-email'],
		primaryContactPhone: submissionRequest['primary-contact-phone'],
		primaryContactRole: submissionRequest['primary-contact-role'],
		primaryContactAttending: submissionRequest['primary-contact-attending'].toLowerCase() === "yes",
		additionalMembers: flattenPersonnel(
			submissionRequest['personnel-name'], 
			submissionRequest['personnel-email'], 
			submissionRequest['personnel-role'],
			submissionRequest['personnel-attending']
		),

		// Performance Needs
		minimumShowLength: submissionRequest['minimum-show-length'],
		maximumShowLength: submissionRequest['maximum-show-length'],
		specialNeeds: submissionRequest['special-needs'],
		noFood: submissionRequest['no-food'],

		// Video
		videoUrls: [
			submissionRequest['video-url-0'],
			submissionRequest['video-url-1'],
			submissionRequest['video-url-2']
		],
		videoInfo: submissionRequest['video-info'],

		// Social Media
		socialMedia: flattenSocialMedia(
			submissionRequest['social-media-type'],
			submissionRequest['social-media-url']
		),

		// Availability
		available: submissionRequest['available'],
		conflicts: flattenConflicts(
			submissionRequest['conflict-act'],
			submissionRequest['conflict-person'],
		),

		// Application Fee
		paymentInfo: null
	}
	submissionModel.create(submission, callback)
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
				attending: personnelAttending[i].toLowerCase() === "yes"
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

function calculateApplicationFee(submission) {
	
	let attendeeCount = 0

	for (let i=0; i<submission.additionalMembers.length; i++)
		if (submission.additionalMembers[i].attending)
			attendeeCount++

	if (submission.primaryContactAttending)
		attendeeCount++

	let applicationFee = (attendeeCount <= 2) ? 15 : 35

	let earlyBirdDeadline = new Date(1519884000000)
	let regularDeadline = new Date(1522558800000)
	let lateDeadline = new Date(1523768400000)
	let currentDate = new Date(Date.now())

	if (currentDate > earlyBirdDeadline) 	applicationFee += 10
	if (currentDate > regularDeadline)		applicationFee += 10
	if (currentDate > lateDeadline)			applicationFee += 10

	return applicationFee
}
module.exports = router