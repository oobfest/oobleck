const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/is-logged-in')
const isRole = require('../middleware/is-role')
const submissionApi = require('../submissions/api')
const limax = require('limax')

// GET /submissions
router.get('/', isLoggedIn, isRole('admin'), (request, response, next)=> {
	submissionApi.getAll((submissions)=> {
		response.render('submissions/view-all', {submissions: submissions})
	})
})

// Todo: HTTP DELETE
router.get('/delete/:objectId', (request, response)=> {
	let objectId = request.params.objectId
	submissionApi.delete(objectId, ()=> {
		console.log("Deleted", objectId)
		response.redirect('/submissions')
	})
})

router.post('/delete-image/:objectId', (request, response)=> {
	let objectId = request.params.objectId
	submissionApi.updateImage(objectId, null, null, ()=> {
		console.log("Deleted image from", objectId)
		response.send({message: "Borat Voice: 'Great success!'"})
	})
})

router.post('/add-image/:objectId', (request, response)=> {
	let objectId = request.params.objectId
	let imageUrl = request.body['image-url']
	let deleteImageUrl = request.body['delete-image-url']
	submissionApi.updateImage(objectId, imageUrl, deleteImageUrl, ()=> {
		console.log("Updated image URLs for", objectId)
		response.send({message: "Borat Voice: 'Very nice!'"})
	})
})

router.get('/review', isLoggedIn, isRole('reviewer'), (request, response)=> {
	submissionApi.getAll((submissions)=> {
		response.render('submissions/review-all', {submissions: submissions})
	})
})

router.get('/review/:objectId', isLoggedIn, isRole('reviewer'), (request, response)=> {
	let objectId = request.params.objectId
	submissionApi.get(objectId, (submission)=> {
		response.render('submissions/review', {submission: submission})
	})
})

router.post('/review/:objectId', isLoggedIn, isRole('reviewer'), (request, response)=> {
	let objectId = request.params.objectId
	let review = {
		userId: request.user._id,
		username: request.user.username,
		score: request.body['score'],
		notes: request.body['notes']
	}
	submissionApi.saveReview(objectId, review, (submission)=> {
		response.redirect('/submissions/review')
	})
})

router.get('/reviews/:objectId', isLoggedIn, isRole('admin'), (request, response)=> {
	let objectId = request.params.objectId
	submissionApi.get(objectId, (submission)=> {
		response.render('submissions/reviews', {submission: submission})
	})
})

// Normally this path would be restricted by roles & signed-in users,
// It's kept public so troup members can edit the form
router.get('/edit/:objectId', (request, response)=> {
	let objectId = request.params.objectId
	submissionApi.get(objectId, (submission)=> {
		response.render('submissions/edit', {submission: submission, user: request.user})
	})
})

router.post('/edit', (request, response)=> {

	let submission = { 
		id: request.body['submission-id'],
		actName: request.body['act-name'],
		domain: limax(request.body['act-name']),
		showType: request.body['show-type'],
		informalDescription: request.body['informal-description'],
		publicDescription: request.body['public-description'],
		accolades: request.body['accolades'],
		country: request.body['country'],
		city: request.body['city'],
		state: request.body['state'],
		homeTheater: request.body['home-theater'],
		primaryContactName: request.body['primary-contact-name'],
		primaryContactEmail: request.body['primary-contact-email'],
		primaryContactPhone: request.body['primary-contact-phone'],
		primaryContactRole: request.body['primary-contact-role'],
		primaryContactAttending: (request.body['primary-contact-attending'].toLowerCase() == 'yes'),
		showLength: request.body['show-length'],
		specialNeeds: request.body['special-needs'],
		imageUrl: request.body['image-url'],
		deleteImageUrl: request.body['delete-image-url'],
		videoUrl: [
			request.body['video-url-0'],
			request.body['video-url-1'],
			request.body['video-url-2']
		],
		videoInfo: request.body['video-info'],
		available: request.body['available'],
		conflicts: request.body['conflicts'],

		additionalMembers: flattenPersonnel(
			request.body['personnel-name'], 
			request.body['personnel-email'], 
			request.body['personnel-role'],
			request.body['personnel-attending']
		),

		socialMedia: flattenSocialMedia(
			request.body['social-media-type'],
			request.body['social-media-url']
		),

	}

	submissionApi.update(submission, (newSubmission)=> {
		response.redirect('/submissions/edit/' + submission.id)
	})
})

function flattenSocialMedia(socialMediaTypes, socialMediaUrls) {
	if (socialMediaTypes) {
		let socialMedia = []
		for(let i=0; i<socialMediaTypes.length; i++) {
			socialMedia.push({
				type: socialMediaTypes[i],
				url: socialMediaUrls[i]
			})
		}
		return socialMedia
	}
	return []
}

function flattenPersonnel(personnelNames, personnelEmails, personnelRoles, personnelAttending) {
	if(personnelNames) {
		let personnel = []
		for(let i=0; i<personnelNames.length; i++) {
			personnel.push({
				name: personnelNames[i],
				email: personnelEmails[i],
				role: personnelRoles[i],
				attending: (personnelAttending[i].toLowerCase() == 'yes')
			})
		}
		return personnel
	}
	return []
}

module.exports = router