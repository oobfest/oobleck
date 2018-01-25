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

// Setup Cookie Parser 🍪😋
const cookieParser = require('cookie-parser')
app.use(cookieParser())

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

// Error handling route
app.use((request, response, next)=> {
	let error = new Error("Not found")
	error.status = 404
	next(error)
})

app.use((error, request, response, next)=> {
	response.status(error.status || 500)
	// In production, we won't output a stack trace from {error: error}
	console.log(error)
	response.render('error', { error: error })
})

// Fleeting, temporary
app.get('/upload', (request, response) => {
	response.render('upload')
})

app.post('/upload', (request, response) => {
	response.send("Meow")
})

// Setup Passport
const passport = require('passport')
let localStrategy = require('passport-local')
app.use(require('express-session')({
	secret: 'Donnie Darko is an overrated movie',
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

let user = require('./users/user.schema')
passport.use(new localStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

// Setup Database
const db = require('./db/setup')

// Listen!
const PORT = process.env.PORT || 3000	// Get port dynamically because of Heroku
app.listen(PORT, () => console.log('Example app listening on port', PORT))

