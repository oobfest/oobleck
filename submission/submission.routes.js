const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator/check')
const submissionValidation = require('./submission.validation')

// GET /apply
router.get('/', (request, response) => {
	response.render('./submission')
})

// POST /apply
router.post('/', submissionValidation, (request, response) => {

	let errors = validationResult(request)
	if (errors.isEmpty())
		response.send("YAY")
	else
		response.render('submission', {errors: errors.array()})
})

// Hypthetically for editing, get back to that one
router.get('/:id/:guid', (request, response) => {
	response.send(request.params)
})

module.exports = router