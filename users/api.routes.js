const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/is-logged-in')
const isRole = require('../middleware/is-role')
const hostApi = require('../users/api')

// CREATE
// POST /users
router.post('/', (request, response)=> {
	let user = { 
		username: request.body.username,
		email: request.body.email,
		isPasswordSet: false,
		roles: request.body.roles
	}
	userApi.create(user, (error)=> {
		if(error) response.send(error)
		else response.json({message: "User created successfully"})
	})
})

// SET OR CHANGE PASSWORD
// POST /users/password/:objectId
router.post('/password/:objectId', (request, response)=> {
	let objectId = request.params.objectId
	let oldPassword = request.body['old-password']
	let newPassword = request.body['password']

	if(oldPassword) {
		userApi.changePassword(objectId, oldPassword, newPassword, (error)=> {
			if(error) response.send(error)
			else response.send({message: "Successfully changed password"})
		})
	}
	else {
		userApi.setPassword(objectId, newPassword, (error)=> {
			if(error) response.send(error)
			else response.send({message: "Successfully set password"})
		})
	}
})

// READ ALL
// GET /users
router.get('/', isLoggedIn, isRole('admin'), (request, response)=> {
	userApi.getAll((error, users)=> {
		if(error) response.send(error)
		else response.send(users)
	})
})

// READ
// GET /users/:objectId
router.get('/:objectId', isLoggedIn, isRole('admin'), (request, response)=> {
	let objectId = request.params.objectId
	userApi.get(objectId, (error, user)=> {
		if(error) response.send(error)
		else response.send(user)
	})
})

// DELETE
// DELETE /users/:objectId
router.delete("/:objectId", isLoggedIn, isRole('admin'), (request, response)=> {
	let objectId = request.params.objectId
	userApi.delete(objectId, (error)=> {
		if(error) response.send(error)
		else response.send({message: "User deleted successfully"})
	})
})

 module.exports = router