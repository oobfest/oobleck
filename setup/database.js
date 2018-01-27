const log = require('winston')

function setupDatabase() {

	var mongoose = require('mongoose')
	mongoose.connect(process.env.MONGO_CONNECTION)

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'))
	db.once('open', function() {
		log.info("Database Ready")
	})	

	return db
}

module.exports = setupDatabase