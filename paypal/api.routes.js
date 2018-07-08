const express = require('express')
const router = express.Router()
const controller = require('./api.controller')

router.post('/create-badge-all-sale', controller.createBadgeAllSale)
router.post('/execute-badge-all-sale', controller.executeBadgeAllSale)
router.post('/create-performer-badge-sale', controller.createPerformerBadgeSale)
router.post('/execute-performer-badge-sale', controller.executePerformerBadgeSale)

router.post('/create-workshop-sale', controller.createWorkshopSale)
router.post('/execute-workshop-sale', controller.executeWorkshopSale)

module.exports = router