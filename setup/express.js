function setupExpress() {
	const express = require('express')
	const app = express()

	app.use(express.static('public/'))	// Static file location
	app.set('view engine', 'pug')		// Pug!
	return app
}

module.exports = setupExpress