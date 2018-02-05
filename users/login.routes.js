const express = require('express')
const router = express.Router()
const passport = require('passport')

// POST /login
// Log user in
router.post('/login', passport.authenticate('local'), (request, response)=> {

	if (request.body['attempted-url']) 				response.redirect(request.body['attempted-url'])
	if (request.user.roles.includes('admin')) 		response.redirect('submissions')
	if (request.user.roles.includes('reviewer')) 	response.redirect('submissions/review')
	
	response.redirect('users/account')

})

// GET /logout
// Log user out
router.get('/logout', (request, response)=> {
	request.app.locals.user = null
	request.logout()
	response.render('login', { info: "You have been logged out!" })
})

module.exports = router