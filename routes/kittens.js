const express = require('express')
const router = express.Router()

const Kitten = require('../db/kitten');

// GET kittens
router.get('/', (request, response) => {
	Kitten.find(function (err, kittens) { 
		response.render( 'kittens', { kittens: kittens })
	})
})

module.exports = router