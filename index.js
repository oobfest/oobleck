const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

let dbConnected = false

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/test', (req, res) => res.send('Database connected: ' + dbConnected))

app.listen(PORT, () => console.log('Example app listening on port', PORT))

// Database stuff
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test')

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  // we're connected!
  console.log("Connected!")
  dbConnected = true
})