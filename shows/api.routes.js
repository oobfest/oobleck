const express = require('express')
const router = express.Router()
const controller = require('./api.controller')
const isLoggedIn = require('../middleware/is-logged-in')
const isRole = require('../middleware/is-role')

router.route('/')
	.get(isLoggedIn, controller.getAll)
	.post(isLoggedIn, controller.create)

router.post('/add-act/:id', isLoggedIn, controller.addAct)
router.post('/remove-act/', isLoggedIn, controller.removeAct)


router.route('/:id')
	.get(isLoggedIn, controller.getById)
	.delete(isLoggedIn, controller.delete)

 module.exports = router