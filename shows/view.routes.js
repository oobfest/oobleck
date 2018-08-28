const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/is-logged-in')
const controller = require('./view.controller')

router.get('/', isLoggedIn, controller.viewAll)
router.get('/print', controller.print)

module.exports = router