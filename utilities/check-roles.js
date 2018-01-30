
function userHasRole(user, role) {
	return user.roles.includes(role)
}

module.exports = userHasRole