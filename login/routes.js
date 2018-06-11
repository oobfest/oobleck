const express = require('express')
const router = express.Router()
const passport = require('passport')

// POST /login
// Log user in
router.post('/login', (request, response, next)=> {
	passport.authenticate('local', (authenticationError, user, info)=> {
		if (authenticationError) next(authenticationError)

		// (user === false) if authentication failed
		if (!user) return response.render('login', {info: info.message})

		request.logIn(user, (loginError)=> {
			if (loginError) next(loginError)

			// If user was trying to get to a specific page, redirect to it
			if (request.body['attempted-url']) {
				return response.redirect(request.body['attempted-url'])
			}
			else {
				// Go to landing page depending on user's role
				let roles = request.user.roles
				if (roles.includes('admin')) 			return response.redirect('calendar')
				if (roles.includes('schedule'))			return response.redirect('calendar')
				if (roles.includes('panelist'))			return response.redirect('error')
				if (roles.includes('standup-panelist'))	return response.redirect('error')
				else return response.redirect('users/account')
			}
		})
	})(request, response, next)
})

// GET /login
router.get('/login', (request, response)=> {
	response.render('login')
})

// GET /logout
// Log user out, get login page
router.get('/logout', (request, response)=> {
	request.logout()
	response.render('login', { info: "You have been logged out!" })
})

module.exports = router