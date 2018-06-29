const router = require('express').Router()
const isLoggedIn = require('../middleware/is-logged-in')
const controller = require('./view.controller')

router.get('/', isLoggedIn, controller.viewAll)
router.get('/delete/:id', isLoggedIn, controller.delete)
router.get('/:id', isLoggedIn, controller.view)

 module.exports = router