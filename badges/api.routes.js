const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/is-logged-in')
const controller = require('./api.controller')

router.get('/', isLoggedIn, controller.getAll)
router.delete('/:id', isLoggedIn, controller.delete)

module.exports = router