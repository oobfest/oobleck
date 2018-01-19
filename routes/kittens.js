const express = require('express')
const router = express.Router()

const Kitten = require('../db/kitten');

// CREATE kitten
router.post('/create', (request, response) => {
	let newKittenName = request.body.name
	let newKitten = new Kitten({ name: newKittenName })
	newKitten.save(function (err, kitten) {
		response.redirect('/kittens')
	})
})

// READ kittens
router.get('/', (request, response) => {
	Kitten.find(function (err, kittens) {
		console.log(kittens)
		response.render( 'kittens', { kittens: kittens })
	})
})

// UPDATE kitten
router.put('/:id', (request, repsonse)=> {
	// Todo
	response.redirect('/kittens')
})

// DELETE kitten
router.delete('/destroy', (request, response) => {
	// Todo
	response.redirect('/kittens')
})

module.exports = router