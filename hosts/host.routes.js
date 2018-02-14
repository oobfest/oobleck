const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/is-logged-in')
const isRole = require('../middleware/is-role')

const hostApi = require('../hosts/host.api')

// GET /hosts
// Get all hosts
router.get('/', isLoggedIn, isRole('admin'), (request, response)=> {
	hostApi.getAll((hosts)=> {
		response.render('hosts/view-all', { users: users })
	})
})

// POST /hosts
// Create host
router.post('/', (request, response)=> {

	let host = { 
		name: request.body.name,
		email: request.body.email,
		bio: request.body.bio,
		experience: request.body.experience
	}

	hostApi.create(host, (newHost)=> {
		response.redirect('/hosts')
	})

})


// GET /hosts/apply
router.get('/apply', (request, response)=> {
	response.render('apply/host-application', { host: {} })
})

 module.exports = router