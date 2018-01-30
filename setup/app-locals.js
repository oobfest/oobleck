const base64 = require('../utilities/base64')

function setAppLocals(app) {
	app.locals.base64 = base64
}

module.exports = setAppLocals