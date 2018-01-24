const express = require('express')
const router = express.Router()

// GET /submissions
router.get('/', (request, response) => {
	response.render('submissions', {username: 'ted'})
})


module.exports = router