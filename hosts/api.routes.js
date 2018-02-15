const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/is-logged-in')
const isRole = require('../middleware/is-role')
const hostApi = require('../hosts/api')

// CREATE
// POST /host
router.post('/', (request, response)=> {

	let host = { 
		name: request.body.name,
		email: request.body.email,
		bio: request.body.bio,
		experience: request.body.experience,
		canAttendMeeting: request.body.canAttendMeeting
	}

	hostApi.create(host, (error)=> {
		if(error) response.send(error)
		else response.json({message: "Host created successfully"})
	})
})

// READ ALL
// GET /hosts
router.get('/', isLoggedIn, isRole('admin'), (request, response)=> {
	hostApi.getAll((error, hosts)=> {
		if(error) response.send(error)
		else response.send(hosts)
	})
})

// READ
// GET /hosts/:objectId
router.get('/:objectId', isLoggedIn, isRole('admin'), (request, response)=> {
	let objectId = request.params.objectId
	hostApi.get(objectId, (error, host)=> {
		if(error) response.send(error)
		else response.send(host)
	})
})

// UPDATE
// PATCH /hosts/:objectId
router.patch("/:objectId", isLoggedIn, isRole('admin'), (request, response)=> {
	let objectId = request.params.objectId
	hostApi.update(objectId, (error)=> {
		if(error) response.send(error)
		else response.send({message: "Host updated successfully"})
	})
})

// DELETE
// DELETE /hosts/:objectId
router.delete("/:objectId", isLoggedIn, isRole('admin'), (request, response)=> {
	let objectId = request.params.objectId
	hostApi.delete(objectId, (error)=> {
		if(error) response.send(error)
		else response.send({message: "Host deleted successfully"})
	})
})

 module.exports = router