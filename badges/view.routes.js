const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/is-logged-in')
const controller = require('./view.controller')

router.get('/', isLoggedIn, controller.viewAll)

module.exports = router