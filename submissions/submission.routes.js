const express = require('express')
const router = express.Router()
const authenticateUser = require('../utilities/authenticate-user')

// GET /submissions
router.get('/', authenticateUser, (request, response)=> {
	response.render('submissions')
})

module.exports = router