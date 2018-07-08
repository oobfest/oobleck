const express = require('express')
const router = express.Router()
const controller = require('./api.controller')
const isLoggedIn = require('../middleware/is-logged-in')
const isRole = require('../middleware/is-role')

router.route('/')
  .get(isLoggedIn, controller.getAll)
  .post(isLoggedIn, controller.create)

router.get('/get-by-domain/:domain', controller.getByDomain)

router.route('/set-date/:id')
  .post(isLoggedIn, controller.setDate)
  .delete(isLoggedIn, controller.deleteDate)

router.route('/public')
  .get(controller.getAllPublic)

router.route('/:id')
  .get(isLoggedIn, controller.getById)
  .put(isLoggedIn, controller.update)
  .delete(isLoggedIn, controller.delete)

 module.exports = router