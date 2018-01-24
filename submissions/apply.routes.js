const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator/check')
const submissionValidation = require('./submission.validation')

// GET /apply
router.get('/', (request, response) => {
	response.render('apply')
})

// POST /apply
router.post('/', submissionValidation, (request, response) => {

	let errors = validationResult(request)
	if (errors.isEmpty())
		response.send("YAY")
	else
		response.render('apply', {errors: errors.array()})
})


module.exports = router