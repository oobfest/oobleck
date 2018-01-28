const express = require('express')
const router = express.Router()
const passport = require('passport')
const authenticateUser = require('../utilities/authenticate-user')
const User = require('../users/user.schema')


module.exports = router