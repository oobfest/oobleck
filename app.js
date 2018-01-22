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

// Setup routes
const routes = require('./routes/index')
const kittens = require('./routes/kittens')
const vue = require('./routes/vue')
const apply = require('./routes/apply')
app.use('/', routes)
app.use('/kittens', kittens)
app.use('/vue', vue)
app.use('/apply', apply)

// Fleeting, temporary
app.get('/upload', (request, response) => {
	response.render('upload')
})

app.post('/upload', (request, response) => {
	response.send("Meow")
})

var aws = require('aws-sdk')

const S3_BUCKET = process.env.AWS_BUCKET_NAME
aws.config.region = 'us-east-2'

// Retrieve a signed request from the app with which the image can be PUT to S3
app.get('/uploady', (request, response) => {
	const s3 = new aws.S3()
	const fileName = request.query['file-name']
	const fileType = request.query['file-type']
	const s3Parameters = {
		Bucket: S3_BUCKET,
		Key: fileName,
		Expires: 60,
		ContentType: fileType,
		ACL: 'public-read'
	}
	s3.getSignedUrl('putObject', s3Parameters, (error, data) => {
		if(error) {
			console.log(error)
			return res.end()
		}
		const returnData = {
			signedRequest: data,
			url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
		}
		response.write(JSON.stringify(returnData))
		response.end()
	})
})

// Setup Database
const db = require('./db/setup')

// Listen!
const PORT = process.env.PORT || 3000	// Get port dynamically because of Heroku
app.listen(PORT, () => console.log('Example app listening on port', PORT))

// Email stuff
//let transporter = nodemailer.createTransport(options[, defaults])