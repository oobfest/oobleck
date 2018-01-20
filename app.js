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

// Setup routes
const routes = require('./routes/index')
const kittens = require('./routes/kittens')
const vue = require('./routes/vue')
const apply = require('./routes/apply')
app.use('/', routes)
app.use('/kittens', kittens)
app.use('/vue', vue)
app.use('/apply', apply)

// Setup Database
const db = require('./db/setup')

// Listen!
const PORT = process.env.PORT || 3000	// Get port dynamically because of Heroku
app.listen(PORT, () => console.log('Example app listening on port', PORT))

// Email stuff
//let transporter = nodemailer.createTransport(options[, defaults])