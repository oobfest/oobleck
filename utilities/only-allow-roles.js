const renderErrorPage = require('../utilities/render-error-page')

// Checks if the user has permission
module.exports = function(allowedRoles) {
	return function(request, response, next) {
		if (!request.app.locals.user) renderErrorPage(response, "You must be logged in")
		let userRoles = request.app.locals.user.roles
		let userHasPermission = arraysHaveElementInCommon(userRoles, allowedRoles)
		if (userHasPermission) next()
		else renderErrorPage(response, "You do not have permission to do that :(")
	}
}

function arraysHaveElementInCommon(array1, array2) {
	return array1.some((element)=> array2.includes(element))
}