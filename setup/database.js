const log = require('winston')

module.exports = async function() {

	// Dependencies
	const mongoose = require('mongoose')

	// Setup
	mongoose.connect(process.env.MONGO_CONNECTION)
	let database = mongoose.connection
	database.on('error', console.error.bind(console, 'Database connection error:'))

	// Log 
	database.once('open', ()=> {log.info("✅  Database connected")})
}