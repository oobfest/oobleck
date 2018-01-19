const PORT = process.env.PORT || 3000

const express = require('express')
const app = express()
app.set('view engine', 'pug')


const routes = require('./routes/index')
const kittens = require('./routes/kittens')
app.use('/', routes)
app.use('/kittens', kittens)

app.listen(PORT, () => console.log('Example app listening on port', PORT))

// Database stuff
var mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_CONNECTION || 'mongodb://localhost/test')

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
	console.log("Connected!")
})