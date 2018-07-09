const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/is-logged-in')
const isRole = require('../middleware/is-role')
const isNotARobot = require('../middleware/is-not-a-robot')
const controller = require('./view.controller')

router.get('/', isLoggedIn, controller.viewAll)
router.post('/', isNotARobot, controller.create)
router.get('/apply', controller.apply)
router.get('/delete/:id', isLoggedIn, isRole('admin'), controller.delete)
router.get('/:id', isLoggedIn, isRole(['admin', 'schedule'], controller.view))

 module.exports = router