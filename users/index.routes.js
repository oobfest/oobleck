const express = require('express')
const router = express.Router()
const passport = require('passport')
const authenticateUser = require('../utilities/authenticate-user')

// GET /
// Home page / log in page
router.get('/', (request, response) => {
	response.render('login')
})

// POST /login
// Log user in
router.post('/login', passport.authenticate('local'), (request, response)=> {
	response.redirect(request.body['attempted-url'] || 'submissions')
})

// GET /logout
// Log user out
router.get('/logout', (request, response)=> {
	request.logout()
	response.render('login', { info: "You have been logged out!" })
})

// GET /hax0rz
// Demo app home screen
router.get('/hax0rz', authenticateUser, (request, response)=> {
	response.render('index', { username: 'Carlton' })
})

module.exports = router