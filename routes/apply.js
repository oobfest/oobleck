const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')

// GET /apply
router.get('/', (request, response) => {
	response.render('apply/apply')
})

let submissionValidation = [
	check('act-name')
		.exists().withMessage("Act name must exist")
		.not().isEmpty().withMessage("Act name cannot be empty")
		.isLength({max: 280}).withMessage("Act name is too long"),
	check('city')
		.exists().withMessage("City missing")
		.not().isEmpty().withMessage("City cannot be empty")
		.isLength({max: 280}).withMessage("City is too long"),
	check('flight-agreement')
		.exists().withMessage("Flight agreement missing")
		.not().isEmpty().withMessage("Flight agreement cannot be empty")
		.isLength({max: 280}).withMessage("Flight agreement is too long"),
	check('informal-description')
		.exists().withMessage("Missing act description")
		.not().isEmpty().withMessage("Act description cannot be empty")
		.isLength({max:1400}).withMessage("Act description is too long"),
	check('primary-contact-email')
		.exists().withMessage("Primary contact email is missing")
		.not().isEmpty().withMessage("Primary contact email cannot be empty")
		.isEmail().withMessage("Primary contact email is invalid")
		.isLength({max:1400}).withMessage("Primary contact email is too long"),
	check('primary-contact-name')
		.exists().withMessage("Primary contact name is missing")
		.not().isEmpty().withMessage("Primary contact name cannot be empty")
		.isLength({max:1400}).withMessage("Primary contact name is too long"),
	check('primary-contact-phone')
		.exists().withMessage("Primary contact phone is missing")
		.not().isEmpty().withMessage("Primary contact phone cannot be empty")
		.isMobilePhone('any').withMessage("Invalid phone number")
		.isLength({max:1400}).withMessage("Email address too long"),
	check('personnel-name.*')
		.isLength({max:280}).withMessage("Personnel name is too long"),
	check('personnel-email.*')
		.not().isEmail().withMessage("Personnel email is invalid")
		.isLength({max:280}).withMessage("Personnel email is too long"),
	check('personnel-role.*')
		.isLength({max:280}).withMessage("Personnel role is too long"),
	check('public-description')
		.exists().withMessage("Public description is missing")
		.not().isEmpty().withMessage("Public description cannot be empty")
		.isLength({max:1400}).withMessage("Public description is too long"),
	check('show-length')
		.exists().withMessage("Show length must exist")
		.not().isEmpty().withMessage("Show length cannot be empty")
		.isNumeric().withMessage("Show length must be numeric"),
	check('show-type')
		.exists().withMessage("Show type must exist")
		.not().isEmpty().withMessage("Show type cannot be empty")
		.isLength({max:140}).withMessage("Show type is too long"),
	check('video-url')
		.exists().withMessage("Video URL must exist")
		.not().isEmpty().withMessage("Video URL cannot be empty")
		.isURL().withMessage("Video URL must be a valid URL")
]

// POST /apply
router.post('/', submissionValidation, (request, response) => {

	let errors = validationResult(request)
	if (errors.isEmpty())
		response.send("YAY")
	else
		response.render('apply/apply', {errors: errors.array()})
})



function validateSubmission(request, response, next) {
	/*
	request.checkBody('act-name', 				"Required").notEmpty()
	request.checkBody('city',					"Required").notEmpty()
	request.checkBody('flight-agreement', 		"Required").notEmpty()
	request.checkBody('informal-description', 	"Required").notEmpty()
	request.checkBody('primary-contact-email', 	"Required").notEmpty()
	request.checkBody('primary-contact-name', 	"Required").notEmpty()
	request.checkBody('primary-contact-phone', 	"Required").notEmpty()
	request.checkBody('primary-contact-role', 	"Required").notEmpty()
	request.checkBody('public-description', 	"Required").notEmpty()
	request.checkBody('show-length', 			"Required").notEmpty()
	request.checkBody('show-type', 				"Required").notEmpty()
	request.checkBody('video-url', 				"Required").notEmpty()

	let errors = request.validationErrors()
	if (errors) {
		console.log("WOMP", errors)
		response.statusCode = 400
		return response.json(errors)
	}
	*/
}

// Hypthetically for editing, get back to that one
router.get('/:id/:guid', (request, response) => {
	response.send(request.params)
})

// AWS stuff
var aws = require('aws-sdk')
aws.config.region = 'us-east-2'
const S3 = new aws.S3()
const S3_BUCKET = process.env.AWS_BUCKET_NAME

// Retrieve a signed request from the app with which the image can be PUT to S3
router.get('/image-upload-request', (request, response) => {
	const fileName = request.query['file-name']
	const fileType = request.query['file-type']
	const s3Parameters = {
		Bucket: S3_BUCKET,
		Key: fileName,
		Expires: 60,
		ContentType: fileType,
		ACL: 'public-read'
	}
	S3.getSignedUrl('putObject', s3Parameters, (error, data) => {
		if(error) {
			console.log(error)
			return res.end()
		}
		const returnData = {
			signedRequest: data,
			url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
		}
		response.write(JSON.stringify(returnData))
		response.end()
	})
})

module.exports = router