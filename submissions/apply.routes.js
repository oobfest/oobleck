const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator/check')
const submissionValidation = require('./submission.validation')
const checkRecaptcha = require('../utilities/check-recaptcha')

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
router.post('/', submissionValidation, checkRecaptcha, (request, response) => {

	let errors = validationResult(request)
	if (errors.isEmpty()) { response.send("YAY") }

	let socialMedia = normalizeSocialMedia(request.body['social-media-type'], request.body['social-media-url'])
	let personnel = normalizePersonnel(request.body['personnel-name'], request.body['personnel-email'], request.body['personnel-role'])
	if (!request.body['available']) request.body['available'] = []

	response.render('apply', {
		recaptcha: true,
		errors: errors.array(),
		socialMedia: socialMedia,
		personnel: personnel,
		submission: request.body
	})
})

function normalizeSocialMedia(socialMediaTypes, socialMediaUrls) {
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

function normalizePersonnel(personnelNames, personnelEmails, personnelRoles) {
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