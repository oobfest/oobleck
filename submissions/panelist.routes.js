const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/is-logged-in')
const isRole = require('../middleware/is-role')
const submissionApi = require('../submissions/api')

// GET /panelist
router.get('/', isLoggedIn, (request, response)=> {

	// Behavior depends on role
	let userRoles = request.user.roles
	if (userRoles.includes('admin')) {
		submissionApi.getAll((error, submissions)=> {
			if(error) response.render('error', {error: error})
			response.render('submissions/panelist-view-all', {submissions: submissions})
		})
	}
	else if (userRoles.includes('panelist')) {
		submissionApi.getAllPaidExceptStandup((error, submissions)=> {
			if(error) response.render('error', {error: error})
			response.render('submissions/panelist-view-all', {submissions: submissions})
		})		
	}
	else if (userRoles.includes('standup-panelist')) {
		submissionApi.getAllPaidStandup((error, submissions)=> {
			if(error) response.render('error', {error: error})
			response.render('submissions/panelist-view-all', {submissions: submissions})
		})
	}
	else {
		renderErrorPage(response, "You do not have permission to do that :(")
	}
})

// GET /panelist/:[submission id]
router.get('/:objectId', isLoggedIn, isRole(['panelist', 'standup-panelist']), (request, response)=> {
	let objectId = request.params.objectId
	submissionApi.get(objectId, (submission)=> {
		response.render('submissions/panelist-review', {submission: submission})
	})

})

router.post('/')
module.exports = router