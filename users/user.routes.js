const express = require('express')
const router = express.Router()
const passport = require('passport')
const authenticateUser = require('../utilities/authenticate-user')
const userApi = require('../users/user.api')

router.get('/', (request, response)=> {
	userApi.getAllUsers((users)=> {
		response.render('users', {username: 'clark', users: users })
	})
})

module.exports = router