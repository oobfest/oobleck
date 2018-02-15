const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator/check')
const submissionValidation = require('../submissions/validation')
const submissionApi = require('../submissions/api')
const limax = require('limax')
const log = require('winston')
const sendEmail = require('../utilities/send-email')

// GET /apply
router.get('/', (request, response) => {
	response.render('apply/first-page', { 
		recaptcha: true, 
		submission: {available: []}, 
		socialMedia: [], 
		personnel: []
	})
})

// GET /apply/hosting
router.get('/hosting', (request, response)=> {
	response.render('apply/host-application', { host: {} })
})

// POST /apply
// From first page to second page
router.post('/', submissionValidation, (request, response) => {

	console.log("DATA IN\n", request.body)

	request.body['available'] = request.body['available']
		? request.body['available']
		: []

	let errors = validationResult(request)
	let submissionIsErrorFree = errors.isEmpty()

	if (submissionIsErrorFree) {
		saveSubmission(request.body, function(submission) {
			console.log("SAVED OBJECT\n", submission)
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
				request.body['personnel-role'],
				request.body['personnel-attending']
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
	submissionApi.updateImage(objectId, imageUrl, deleteImageUrl, (submission)=> {
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
		conflicts: submissionRequest['conflicts'],

		// Application Fee
		paymentInfo: null
	}
	console.log("SAVING OBJECT\n", submission)
	submissionApi.create(submission, callback)
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

module.exports = router