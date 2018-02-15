const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/is-logged-in')
const isRole = require('../middleware/is-role')
const hostApi = require('../hosts/api')

router.get('/', isLoggedIn, isRole('admin'), (request, response)=> {
	hostApi.getAll((error, hosts)=> {
		response.render('hosts/view-all', { hosts: hosts })
	})
})

router.get('/:objectId', isLoggedIn, isRole('admin'), (request, response)=> {
	let objectId = request.params.objectId
	console.log(objectId)
	hostApi.get(objectId, (error, host)=> {
		if(error) response.render('error', {error: error})
		else response.render('hosts/view', {host: host})
	})
})

router.post('/', (request, response)=> {

	let host = { 
		name: request.body['name'],
		email: request.body['email'],
		phone: request.body['phone'],
		bio: request.body['bio'],
		experience: request.body['experience'],
		imageUrl: request.body['image-url'],
		deleteImageUrl: request.body['delete-image-url'],
		videoUrl: request.body['video-url'],
		available: request.body['available'],
		canAttendMeeting: request.body['can-attend-meeting'] == 'on'
	}

	hostApi.create(host, (newHost)=> {
		response.render('apply/thank-you-host', { host: host })
	})

})

router.get('/delete/:objectId', (request, response)=> {
	let objectId = request.params.objectId
	hostApi.delete(objectId, (error)=> {
		if(error) response.render('error', {error: error})
		else response.redirect('/hosts')
	})
})

 module.exports = router