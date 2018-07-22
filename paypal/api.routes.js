const express = require('express')
const router = express.Router()
const controller = require('./api.controller')

router.post('/create-badge-all-sale', controller.createBadgeAllSale)
router.post('/execute-badge-all-sale', controller.executeBadgeAllSale)
router.post('/create-performer-badge-sale', controller.createPerformerBadgeSale)
router.post('/execute-performer-badge-sale', controller.executePerformerBadgeSale)
router.post('/create-ticket-sale/:id', controller.createTicketSale)
router.post('/execute-ticket-sale/:id', controller.executeTicketSale)
router.post('/create-workshop-sale', controller.createWorkshopSale)
router.post('/execute-workshop-sale', controller.executeWorkshopSale)

router.options('/create-ticket-sale/:id', controller.cors)
router.options('/execute-ticket-sale/:id', controller.cors)

module.exports = router