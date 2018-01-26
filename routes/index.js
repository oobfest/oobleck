const express = require('express')
const router = express.Router()
const passport = require('passport')
const checkAuthentication = require('../utilities/check-authentication')

// GET /
// Home page / log in page
router.get('/', (request, response) => {
	response.render( 'login' )
})

// POST /login
// Logs user in, redirects to /hax0rz
// If unsuccessful, goes to login page
router.post('/login', passport.authenticate('local', {
	successRedirect: '/hax0rz',
	failureRedirect: '/login' 
}))

// GET /logout
// Logs user out, redirects to log in page
router.get('/logout', (request, response)=> {
	request.logout()
	response.render('login', { loggedOut: true })
})

// GET /hax0rz
// Demo app home screen
router.get('/hax0rz', checkAuthentication, (request, response)=> {
	response.render('index', { username: 'Carlton' })
})

module.exports = router