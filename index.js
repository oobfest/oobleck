require('./setup/environment-variables')()

const express = require('express')
const app = express()

const path = require('path')
app.use(express.static(path.join(__dirname, 'public/')))

require('./setup/express')(app)
require('./setup/compression')(app)
require('./setup/body-parser')(app)
require('./setup/express-session')(app)
require('./setup/logging')(app)
require('./setup/passport')(app)
require('./setup/routes')(app)
require('./setup/database')()

const log = require('winston')

// ERROR STUFF
// https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
process.on('uncaughtException', (error)=> { 
	log.error("UNCAUGHT EXCEPTION :(")
	log.error("[Inside 'uncaughtException' event] " + error.stack || error.message )
	process.exit(1)
})

// Listen!
app.listen(process.env.PORT, ()=> {
	log.info("🐵  Listening on port " + process.env.PORT)
})