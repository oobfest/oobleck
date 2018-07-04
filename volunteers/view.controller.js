const model = require('./model')

module.exports = {
	viewAll: function(request, response, next) {
		model.getAll((error, volunteers)=> {
			if(error) next(error)
			else response.render('volunteers/view-all', { volunteers })
		})
	}
}