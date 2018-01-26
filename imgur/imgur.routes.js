const express = require('express')
const router = express.Router()

let imgurCredentials = {
	clientId: process.env.IMGUR_CLIENT_ID,
	clientSecret: process.env.IMGUR_CLIENT_SECRET
}

router.get('/', (request,response)=> {
	response.render('imgur')
})

router.post('/', (request, response)=> {
	response.send("Woo")
})

module.exports = router