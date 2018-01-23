const express = require('express')
const router = express.Router()

// GET home page
router.get('/', (request, response) => {
	response.render( 'login', { navigation: false })
})

router.get('/hax0rz', (request, response) => {
	response.render('index', { navigation: true })
})

module.exports = router