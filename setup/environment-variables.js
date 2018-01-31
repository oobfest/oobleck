const log = require('winston')

function setupEnvironment() {

	// Get .env data if not Heroku
	console.log("Heroku", process.env.HEROKU)
	if (process.env.HEROKU !== "1") {
		log.info("Loading .env file")
		dotenvResult = require('dotenv').load()
		if (dotenvResult.error) {
			log.error("DotEnv failed")
			if(dotenvResult.error.code == 'ENOENT') {
				log.error("Could not find .env file")
				throw new Error("No .env file")
			}
			else {
				log.error(dotenvResult)
				throw new Error("Dotenv error")
			}
		}
	}

	// Check for missing variables
	let expectedEnvironmentVariables = [
		'PORT',
		'MONGO_CONNECTION',
		'RECAPTCHA_SECRET_KEY',
		'NO_REPLY_PASSWORD'
	]
	
	expectedEnvironmentVariables.forEach((variable) => {
	  if (!process.env[variable]) {
	    throw new Error(`Environment variable ${variable} is missing!`)
	  }
	})

	log.info("Environment Variables ✅")
}

module.exports = setupEnvironment