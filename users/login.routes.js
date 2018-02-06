const express = require('express')
const router = express.Router()
const passport = require('passport')

// POST /login
// Log user in
/*
router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), (request, response)=> {

	if (request.body['attempted-url']) 				response.redirect(request.body['attempted-url'])
	if (request.user.roles.includes('admin')) 		response.redirect('submissions')
	if (request.user.roles.includes('reviewer')) 	response.redirect('submissions/review')
	
	response.redirect('users/account')
})*/

router.post('/login', (request, response, next)=> {
	passport.authenticate('local', (error, user, info)=> {
		if (error) throw new Error(error)
		console.log(info)
		if (!user) return response.render('login', {info: info.message})
		request.logIn(user, (loginError)=> {
			if (loginError) throw new Error(loginError)

			// Redirect to page depending on user's role
			if (request.body['attempted-url']) 				return response.redirect(request.body['attempted-url'])
			if (request.user.roles.includes('admin')) 		return response.redirect('submissions')
			if (request.user.roles.includes('reviewer')) 	return response.redirect('submissions/review')
			return response.redirect('users/account')

		})
	})(request, response, next)
})

// GET /login
router.get('/login', (request, response)=> {
	response.render('login')
})

// GET /logout
// Log user out
router.get('/logout', (request, response)=> {
	request.app.locals.user = null
	request.logout()
	response.render('login', { info: "You have been logged out!" })
})

module.exports = router