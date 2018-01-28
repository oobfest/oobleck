const express = require('express')
const router = express.Router()
const authenticateUser = require('../utilities/authenticate-user')

const submissionApi = require('./submission.api')

// GET /submissions
router.get('/', authenticateUser, (request, response)=> {
	submissionApi.getAllSubmissions((submissions)=> {
		response.render('submissions', {username: 'fake', submissions: submissions})
	})
})

// Todo: HTTP DELETE
router.get('/delete/:objectId', (request, response)=> {
	let objectId = request.params.objectId
	submissionApi.deleteSubmission(objectId, ()=> {
		console.log("Deleted", objectId)
		response.redirect('/submissions')
	})
})

module.exports = router