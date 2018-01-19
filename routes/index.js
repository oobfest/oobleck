const express = require('express')
const router = express.Router()

// GET home page
router.get('/', (request, response) => {
	response.render( 'index', { name: "Carl" })
})

module.exports = router