const express = require('express')
const router = express.Router()
const authenticateUser = require('../utilities/authenticate-user')
const submissionApi = require('./submission.api')

// GET /submissions
router.get('/', authenticateUser, (request, response)=> {
	submissionApi.getAllSubmissions((submissions)=> {
		response.render('submissions/view-all', {username: 'fake', submissions: submissions} )
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

router.get('/review/:objectId', authenticateUser, (request, response)=> {
	let objectId = request.params.objectId
	submissionApi.getSubmission(objectId, (submission)=> {
		response.render('submissions/review', {submission: submission})
	})
})

// Normally this path would be restricted by roles & signed-in users,
// It's kept public so troup members can edit the form
router.get('/edit/:objectId', (request, response)=> {
	let objectId = request.params.objectId
	submissionApi.getSubmission(objectId, (submission)=> {
		response.render('submissions/edit', {submission: submission})
	})
})

router.post('/edit', (request, response)=> {
	let submission = request.body.submission
	submissionApi.updateSubmission()
})

module.exports = router