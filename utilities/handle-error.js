module.exports = function(response, errorMessage, errorStatus) {
	response.render('error', {error: {message: errorMessage, status: errorStatus || ''}})
}