const express = require('express')
const router = express.Router()
const passport = require('passport')
const isLoggedIn = require('../middleware/is-logged-in')
const userApi = require('../users/user.api')
const isRole = require('../middleware/is-role')

router.get('/', isLoggedIn, isRole(['admin']), (request, response)=> {
	userApi.getAllUsers((users)=> {
		response.render('users/view-all', {username: 'clark', users: users })
	})
})

router.post('/', isRole(['admin']), (request, response)=> {
	let user = { 
		username: request.body.username,
		password: request.body.password,
		roles: request.body.roles
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