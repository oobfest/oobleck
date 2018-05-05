const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/is-logged-in')
const isRole = require('../middleware/is-role')
const isNotARobot = require('../middleware/is-not-a-robot')
const controller = require('./view.controller')

router.get('/', isLoggedIn, isRole(['admin', 'schedule']), controller.schedule)
router.get('/old', isLoggedIn, controller.scheduleOld)

module.exports = router;