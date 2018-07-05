const express = require('express')
const router = express.Router()
const controller = require('./api.controller')

router.post('/create-badge-all-sale', controller.createBadgeAllSale)
router.post('/execute-badge-all-sale', controller.executeBadgeAllSale)
router.post('/create-performer-badge-sale', controller.createPerformerBadgeSale)
router.post('/execute-performer-badge-sale', controller.executePerformerBadgeSale)

module.exports = router