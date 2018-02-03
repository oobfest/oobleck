const express = require('express')
const router = express.Router()
const passport = require('passport')

// POST /login
// Log user in
router.post('/login', passport.authenticate('local'), (request, response)=> {
	response.redirect(request.body['attempted-url'] || 'submissions')
})

// GET /logout
// Log user out
router.get('/logout', (request, response)=> {
	request.app.locals.user = null
	request.logout()
	response.render('login', { info: "You have been logged out!" })
})

module.exports = router