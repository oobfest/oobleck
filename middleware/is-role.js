const renderErrorPage = require('../utilities/handle-error')

// Checks if the user has permission
module.exports = function(allowedRoles) {
	return function(request, response, next) {
		let userRoles = request.user.roles
		let userHasPermission = areElementsInCommon(userRoles, allowedRoles)
		if (userHasPermission) next()
		else renderErrorPage(response, "You do not have permission to do that :(")
	}
}

function areElementsInCommon(array1, array2) {
	return array1.some((element)=> array2.includes(element))
}