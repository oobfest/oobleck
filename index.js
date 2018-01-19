const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(PORT, () => console.log('Example app listening on port', PORT))

// Database stuff
var mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_CONNECTION)

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
	console.log("Connected!")

	var kittySchema = mongoose.Schema({ name: String })
	var Kitten = mongoose.model('Kitten', kittySchema)
	Kitten.find(function (err, kittens) { console.log(kittens) })

	var animalSchema = mongoose.Schema({ type: String })
	var Animal = mongoose.model('Animal', animalSchema)
	Animal.find(function (err, animals) { console.log(animals) })
})