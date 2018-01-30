const express = require('express')
const router = express.Router()
const passport = require('passport')
const authenticateUser = require('../utilities/authenticate-user')
const userApi = require('../users/user.api')

router.get('/', authenticateUser, (request, response)=> {
	userApi.getAllUsers((users)=> {
		response.render('users', {username: 'clark', users: users })
	})
})

router.post('/', (request, response)=> {
	let user = { 
		username: request.body.username,
		password: request.body.password
	}
	userApi.createUser(user, (newUser)=> {
		response.redirect('/users')
	})
})

router.get('/delete/:objectId', (request, response)=> {
	let objectId = request.params.objectId
	userApi.deleteUser(objectId, ()=> {
		response.redirect('/users')
	})
})

module.exports = router