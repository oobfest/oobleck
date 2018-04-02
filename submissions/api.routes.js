const express = require('express')
const router = express.Router()
const controller = require('./api.controller')
const isLoggedIn = require('../middleware/is-logged-in')
const isRole = require('../middleware/is-role')

router.route('/').get(isLoggedIn, controller.getAll)
router.route('/getAllPaid').get(isLoggedIn, isRole(['admin', 'schedule']), controller.getAllPaid)
router.route('/getAllPaidExceptStandup').get(isLoggedIn, isRole('panelist'), controller.getAllPaidExceptStandup)
router.route('/getAllPaidStandup').get(isLoggedIn, isRole('standup-panelist'), controller.getAllPaidStandup)

router.post('/add-theater-tag', isLoggedIn, isRole(['admin', 'schedule']), controller.addTheaterTag)
router.post('/remove-theater-tag', isLoggedIn, isRole(['admin', 'schedule']), controller.removeTheaterTag)

router.post('/standardize', isLoggedIn, isRole(['admin', 'schedule']), controller.standardize)
module.exports = router