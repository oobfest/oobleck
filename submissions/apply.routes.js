const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator/check')
const submissionValidation = require('./submission.validation')
const submissionApi = require('./submission.api')
const limax = require('limax')
const log = require('winston')
const sendEmail = require('../email/send-email')

// GET /apply
router.get('/', (request, response) => {
	response.render('apply/first-page', { 
		recaptcha: true, 
		submission: {available: []}, 
		socialMedia: [], 
		personnel: [] 
	})
})

// POST /apply
router.post('/', submissionValidation, (request, response) => {

	request.body['available'] = request.body['available']
		? request.body['available']
		: []

	let errors = validationResult(request)
	let submissionIsErrorFree = errors.isEmpty()

	if (submissionIsErrorFree) {
		saveSubmission(request.body, function(submission) {
			response.render('apply/second-page', {submission: submission})
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
				request.body['personnel-role']
			),
			submission: request.body
		})	
	}
})

router.post('/pay/:objectId', (request, response)=> {
	let objectId = request.params.objectId
	let paymentInfo = request.body.paymentInfo
	submissionApi.updatePayment(objectId, paymentInfo, (submission)=> {
		console.log("Saved payment", submission.paymentInfo)
		response.send({'cool-message': "YAY!"})
	})
})

router.post('/finish', (request, response)=>{
	let objectId = request.body['id']
	let imageUrl = request.body['image-url']
	let deleteImageUrl = request.body['delete-image-url']
	console.log("POST", objectId, imageUrl, deleteImageUrl)
	submissionApi.updateSubmissionImage(objectId, imageUrl, deleteImageUrl, (submission)=> {
		// Double-check that they payed
		if (submission.paymentInfo !== null) {
			let subject = "Thank you for applying to Out of Bounds 2018!"
			let message = `We received your application for ${submission.actName}\nTo view & edit your profile, please use this URL: https://${request.hostname}/submissions/edit/${submission._id}\nAnyone with this URL can edit your application, so keep it safe!!`
			sendEmail(submission.primaryContactEmail, subject, message, (email)=> {
				console.log("Sent email: ", email)
				response.render('apply/thank-you', {submission: submission})
			})
		}
		else {
			response.render('apply/second-page', {submission: submission, errors: [ {msg: "Something went wrong with the payment. Contact admin@oobfest.com if necessary!"}]})
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
		additionalMembers: flattenPersonnel(
			submissionRequest['personnel-name'], 
			submissionRequest['personnel-email'], 
			submissionRequest['personnel-role']
		),

		// Performance Needs
		showLength: submissionRequest['show-length'],
		specialNeeds: submissionRequest['special-needs'],

		// Video
		videoUrl: submissionRequest['video-url'],
		videoInfo: submissionRequest['video-info'],

		// Social Media
		socialMedia: flattenSocialMedia(
			submissionRequest['social-media-type'],
			submissionRequest['social-media-url']
		),

		// Availability
		available: submissionRequest['available'],
		conflicts: submissionRequest['conflicts'],

		// Application Fee
		paymentInfo: null
	}
	console.log("What's being saved: ", submission)
	submissionApi.createSubmission(submission, callback)
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

function flattenPersonnel(personnelNames, personnelEmails, personnelRoles) {
	if(personnelNames) {
		let personnel = []
		for(let i=0; i<personnelNames.length; i++) {
			personnel.push({
				name: personnelNames[i],
				email: personnelEmails[i],
				role: personnelRoles[i]
			})
		}
		return personnel
	}
	return []
}

module.exports = router