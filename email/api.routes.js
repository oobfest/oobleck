const express = require('express')
const router = express.Router()
const controller = require('./api.controller')

router.post('/contact', controller.sendContactEmail)

module.exports = router