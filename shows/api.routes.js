const express = require('express')
const router = express.Router()
const controller = require('./api.controller')
const isLoggedIn = require('../middleware/is-logged-in')
const isRole = require('../middleware/is-role')

router.route('/')
	.get(isLoggedIn, controller.getAll)
	.post(isLoggedIn, controller.create)

router.get('/public', controller.getShows)
router.get('/public/:id', controller.getShowById)
router.post('/badge-reservation/:id', controller.badgeReservation)
router.options('/badge-reservation/:id', controller.coorz)
router.post('/comp-reservation/:id', isLoggedIn, controller.compReservation)
router.post('/remove-reservation/:id', controller.removeReservation)
router.options('/remove-reservation/:id', controller.coorz)
router.post('/set-capacity/:id', isLoggedIn, controller.setCapacity)
router.post('/set-price/:id', isLoggedIn, controller.setPrice)

router.post('/set-volunteer/')

router.get('/publish', isLoggedIn, controller.publish)

router.post('/add-act/:id', isLoggedIn, controller.addAct)
router.post('/remove-act/', isLoggedIn, controller.removeAct)
router.get('/get-by-act/:id', controller.getByActId)
router.put('/update-duration/:id', isLoggedIn, controller.updateDuration)
router.post('/set-host/:id', isLoggedIn, controller.setHost)
router.post('/remove-host/:id', isLoggedIn, controller.removeHost)
router.post('/set-end-time/:id', isLoggedIn, controller.setEndTime)

router.get('/get-remaining-tickets/:id', controller.getRemainingTickets)
router.options('/get-remaining-tickets/:id', controller.coorz)

router.route('/:id')
	.get(isLoggedIn, controller.getById)
  .put(isLoggedIn, controller.update)
	.delete(isLoggedIn, controller.delete)

 module.exports = router