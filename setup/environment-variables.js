const log = require('winston')

module.exports = function() {

	// Setup
	// If we're not running on Heroku, load Environment variables from .env file
	if (process.env.HEROKU !== "1") {
		log.info("💁‍♂️  Using .env file for environment variables")
		dotenvResult = require('dotenv').load()
		if (dotenvResult.error) {
			log.error("⛔️  DotEnv failed")
			if(dotenvResult.error.code == 'ENOENT') {
				log.error("⛔️  Could not find .env file")
				throw new Error("No .env file")
			}
			else {
				log.error("⛔️  Error with dotenv!", dotenvResult)
				throw new Error("Dotenv error")
			}
		}
	}
	else {
		log.info("Heroku detected!")
	}

	// Confirm we have all environment variables
	const variableNameList = [
		'PORT', 
		'MONGO_CONNECTION', 
		'RECAPTCHA_SECRET_KEY', 
		'NO_REPLY_PASSWORD',
		'TWILIO_SID',
		'TWILIO_TOKEN',
		'TWILIO_RECIPIENT'
	]

	for(let i=0; i<variableNameList.length; i++) {
		let variableName = variableNameList[i]
		let variableValue = process.env[variableName]
		let variableIsMissing = (typeof variableValue === 'undefined')
		if (variableIsMissing) throw new Error(`⛔️  Environment variable ${variableName} is missing!`)
	}

	// Log
	log.info("✅  Environment Variables")
}