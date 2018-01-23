const express = require('express')
const router = express.Router()

// GET home page
router.get('/', (request, response) => {
	response.render( 'login' )
})

router.get('/hax0rz', (request, response) => {
	response.render('index', { username: 'Carlton' })
})

module.exports = router