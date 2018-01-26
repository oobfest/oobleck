const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator/check')
const submissionValidation = require('./submission.validation')

// GET /apply
router.get('/', (request, response) => {
	response.render('apply', { submission: {}, socialMedia: [], personnel: [] })
})

// POST /apply
router.post('/', submissionValidation, (request, response) => {

	let errors = validationResult(request)
	if (errors.isEmpty())
		response.send("YAY")
	else
		response.render('apply', {
			errors: errors.array(),
			socialMedia: normalizeSocialMedia(request.body['social-media-type'], request.body['social-media-url']),
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
		console.log(socialMedia)
		return socialMedia
	}
	return []
}

module.exports = router