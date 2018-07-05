const express = require('express')
const router = express.Router()
const controller = require('./api.controller')
const isLoggedIn = require('../middleware/is-logged-in')
const isRole = require('../middleware/is-role')

router.route('/').get(isLoggedIn, controller.getAll)
router.route('/get/:submissionId').get(isLoggedIn, isRole(['staff']), controller.get)

// TODO: Routes should be kebabs, not camels whoopz
router.route('/getAllPaid').get(isLoggedIn, isRole(['staff']), controller.getAllPaid)
router.route('/getAllPaidExceptStandup').get(isLoggedIn, isRole('panelist'), controller.getAllPaidExceptStandup)
router.route('/getAllPaidStandup').get(isLoggedIn, isRole('standup-panelist'), controller.getAllPaidStandup)
router.route('/get-all-accepted').get(controller.getAllAccepted)
router.route('/get-valid-acts').get(controller.getValidActs)
router.route('/get-act/:domain').get(controller.getActByDomain)

router.route('/delete-review').post(isLoggedIn, isRole(['staff']), controller.deleteReview)

router.post('/add-theater-tag', isLoggedIn, isRole(['staff']), controller.addTheaterTag)
router.post('/remove-theater-tag', isLoggedIn, isRole(['staff']), controller.removeTheaterTag)

router.post('/standardize', isLoggedIn, isRole(['staff']), controller.standardize)

router.post('/stamp-accept', isLoggedIn, isRole(['staff']), controller.stampAccept)
router.post('/stamp-purgatory', isLoggedIn, isRole(['staff']), controller.stampPurgatory)
router.post('/stamp-reject', isLoggedIn, isRole(['staff']), controller.stampReject)

router.post('/add-note', isLoggedIn, isRole(['staff']), controller.addNote)

router.route('/confirm-performer-email')
  .post(controller.confirmPerformerEmail)
  .options(function(request, response) {
    response.header("Access-Control-Allow-Origin", "*")
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    response.end()
  })

module.exports = router