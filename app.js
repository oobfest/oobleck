require('./setup/environment-variables')()

const express = require('express')
const app = express()

app.use(express.static('public/'))	// Static file location

require('./setup/express')(app)
require('./setup/cookie-parser')(app)
require('./setup/body-parser')(app)
require('./setup/express-session')(app)
require('./setup/logging')(app)
require('./setup/passport')(app)
require('./setup/routes')(app)
require('./setup/database')()

// Listen!
const log = require('winston')
app.listen(process.env.PORT, ()=> {
	log.info("Listening on port " + process.env.PORT)
})