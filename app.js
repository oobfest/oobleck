// Get .env data if not Heroku
if (process.env.HEROKU !== 1) {
	require('dotenv').load()
}

// Setup Express
const express = require('express')
const app = express()
app.use(express.static('public/'))	// Static file location

// Setup Body Parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Setup Pug
app.set('view engine', 'pug')

// Setup logging
const logging = require('./utilities/logging')
app.use(logging)

// Setup routes
const indexRouter = require('./routes/index')
const applyRoutes = require('./submissions/apply.routes')
const submissionRoutes = require('./submissions/submission.routes')
app.use('/', indexRouter)
app.use('/apply', applyRoutes)
app.use('/submissions', submissionRoutes)

// Fleeting, temporary
app.get('/upload', (request, response) => {
	response.render('upload')
})

app.post('/upload', (request, response) => {
	response.send("Meow")
})

// Setup Database
const db = require('./db/setup')

// Listen!
const PORT = process.env.PORT || 3000	// Get port dynamically because of Heroku
app.listen(PORT, () => console.log('Example app listening on port', PORT))

// Email stuff
//let transporter = nodemailer.createTransport(options[, defaults])