const express = require('express')
const router = express.Router()

// GET Vue page
router.get('/', (request, response) => {
	response.render('vue')
})

module.exports = router