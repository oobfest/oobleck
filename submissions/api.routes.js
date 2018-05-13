const express = require('express')
const router = express.Router()
const controller = require('./api.controller')
const isLoggedIn = require('../middleware/is-logged-in')
const isRole = require('../middleware/is-role')

router.route('/').get(isLoggedIn, controller.getAll)
router.route('/get/:submissionId').get(isLoggedIn, isRole(['admin', 'schedule']), controller.get)

// TODO: Routes should be kebabs, not camels whoopz
router.route('/getAllPaid').get(isLoggedIn, isRole(['admin', 'schedule']), controller.getAllPaid)
router.route('/getAllPaidExceptStandup').get(isLoggedIn, isRole('panelist'), controller.getAllPaidExceptStandup)
router.route('/getAllPaidStandup').get(isLoggedIn, isRole('standup-panelist'), controller.getAllPaidStandup)

router.route('/delete-review').post(isLoggedIn, isRole(['admin', 'schedule']), controller.deleteReview)

router.post('/add-theater-tag', isLoggedIn, isRole(['admin', 'schedule']), controller.addTheaterTag)
router.post('/remove-theater-tag', isLoggedIn, isRole(['admin', 'schedule']), controller.removeTheaterTag)

router.post('/standardize', isLoggedIn, isRole(['admin', 'schedule']), controller.standardize)

router.post('/stamp-accept', isLoggedIn, isRole(['admin', 'schedule']), controller.stampAccept)
router.post('/stamp-purgatory', isLoggedIn, isRole(['admin', 'schedule']), controller.stampPurgatory)
router.post('/stamp-reject', isLoggedIn, isRole(['admin', 'schedule']), controller.stampReject)

module.exports = router