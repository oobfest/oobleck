const express = require('express')
const router = express.Router()
const passport = require('passport')
const isLoggedIn = require('../middleware/is-logged-in')
const isRole = require('../middleware/is-role')
const userApi = require('../users/api')


// GET /user
// Get all users
router.get('/', isLoggedIn, isRole('admin'), (request, response)=> {
	userApi.getAll((error, users)=> {
		if(error) response.render('error', {error: error})
		response.render('users/view-all', { users: users })
	})
})

// POST /user
// Create user
router.post('/', isLoggedIn, isRole('admin'), (request, response)=> {
	let user = { 
		username: request.body.username,
		email: request.body.email,
		isPasswordSet: false,
		password: null,
		roles: request.body.roles
	}
	userApi.create(user, (error)=> {
		if(error) response.render('error', {error: error})
		response.redirect('/users')
	})
})

// GET /users/password/:objectId
// Get form for changing a password for a user
router.get('/password/:objectId', (request, response)=> {
	let objectId = request.params.objectId
	userApi.get(objectId, (error, editUser)=> {
		if(error) response.render('error', {error: error})
		response.render('users/password', {editUser: editUser})
	})
})

// POST /password/:objectId
// Set (or change) Password
router.post('/password/:objectId', (request, response)=> {
	let objectId = request.params.objectId
	let oldPassword = request.body['old-password']
	let newPassword = request.body['password']

	if(oldPassword) {
		userApi.changePassword(objectId, oldPassword, newPassword, (error)=> {
			if(error) response.render('error', {error: error})
			response.render('login', { info: "Password changed! You can now log in."})
		})
	}
	else {
		userApi.setPassword(objectId, newPassword, (error)=> {
			if(error) response.render('error', {error: error})
			response.render('login', { info: "Password set! You can now log in." })
		})
	}

})

// GET /user/edit/:objectId
router.get('/edit/:objectId', isLoggedIn, isRole('admin'), (request, response)=> {
	let objectId = request.params.objectId
	userApi.get(objectId, (error, user)=> {
		if(error) response.render('error', {error: error})
		response.render('users/edit', { editUser: user })
	})
})

// POST /user/edit/:objectId
// Update user
router.post('/edit/:objectId', isLoggedIn, isRole('admin'), (request, response)=> {
	let objectId = request.params.objectId
	let user = {
		username: request.body['username'],
		email: request.body['email'],
		roles: request.body['roles']
	}
	userApi.update(objectId, user, ()=> {
		response.redirect('/users')
	})
})

// GET /user/password
// Set password page
router.get('/password/:objectId', (request, response)=> {
	let objectId = request.params.objectId
	userApi.getById(objectId, (error, editUser)=> {
		if(error) response.render('error', {error: error})
		response.render('users/set-password', {editUser: editUser})
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
	userApi.get(objectId, (error, user)=> {
		if(error) response.render('error', {error: error})
		response.render('users/account')
	})
})

module.exports = router