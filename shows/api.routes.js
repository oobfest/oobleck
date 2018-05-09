const express = require('express')
const router = express.Router()
const controller = require('./api.controller')
const isLoggedIn = require('../middleware/is-logged-in')
const isRole = require('../middleware/is-role')

router.route('/')
	.get(isLoggedIn, controller.getAll)
	.post(controller.create)

router.route('/:id')
	.get(isLoggedIn, controller.getById)
	.put(controller.update)
	.delete(isLoggedIn, controller.delete)

 module.exports = router