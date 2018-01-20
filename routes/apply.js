const express = require('express')
const router = express.Router()

router.get('/', (request, response) => {
	response.render('apply')
})

router.post('/', (request, response)=> {
	response.render('thank-you')
})

module.exports = router