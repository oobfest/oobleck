const log = require('winston')

// Setup & check environment variables
require('./setup/environment-variables')()

// Setup Express
//const app = require('./setup/express')
const express = require('express')
const app = express()

app.use(express.static('public/'))	// Static file location
app.set('view engine', 'pug')		// Pug!

require('./setup/cookie-parser')(app)
require('./setup/body-parser')(app)
require('./setup/express-session')(app)
require('./setup/logging')(app)
require('./setup/passport')(app)
require('./setup/router')(app)
require('./setup/database')()

// Listen!
app.listen(process.env.PORT, ()=> {
	log.info("Listening on port " + process.env.PORT)
})