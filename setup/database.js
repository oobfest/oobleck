const log = require('winston')

module.exports = async function() {

	// Dependencies
	const mongoose = require('mongoose')

	// Setup
	mongoose
    .connect(process.env.MONGO_CONNECTION)
    
    // Log
    .then(function() { log.info("✅  Database connected")})
    .catch(function(error) { 
      log.error("⛔️ Database not connected")
    })
}