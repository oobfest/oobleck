const express = require('express')
const router = express.Router()
const checkRecaptcha = require('../utilities/check-recaptcha')
const { validationResult } = require('express-validator/check')
const submissionValidation = require('./submission.validation')
const submissionApi = require('./submission.api')

// GET /apply
router.get('/', (request, response) => {
	response.render('apply', { 
		recaptcha: true, 
		submission: {available: []}, 
		socialMedia: [], 
		personnel: [] 
	})
})

// POST /apply
router.post('/', submissionValidation, (request, response) => {

	if (!request.body['available']) 
		request.body['available'] = []

	let errors = validationResult(request)
	let submissionIsErrorFree = errors.isEmpty()

	if (submissionIsErrorFree) {
		saveSubmission(request.body, function(submission) {
			response.send("Saved the submission!")
		})
	}
	else {
		response.render('apply', {
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

function saveSubmission(submissionRequest, callback) {

	let submission = { 

		// Act Details
		actName: submissionRequest['act-name'],
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
		showLength: -100,
		specialNeeds: submissionRequest['special-needs'],

		// Photo
		photoUrl: null,

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
		payedFee: false
	}

	console.log("Step one", submission)
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