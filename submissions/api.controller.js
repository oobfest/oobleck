const model = require('./model')

module.exports = {

	getAll: function(request, response, next) {
		model.getAll((error, submissions)=> {
			if(error) next(error)
			else response.send(submissions)
		})
	}
}