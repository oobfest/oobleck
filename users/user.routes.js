const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../users/user.schema')

router.get('/test', (request, response)=> {
	response.send("Ping!")
})

module.exports = router