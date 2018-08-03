const model = require('./model')

module.exports = {
	viewAll: function(request, response, next) {
		response.render('volunteers/view-all')
	},

  schedule: function(request, response, next) {
    response.render('volunteers/schedule')
  },

  apply: function(request, response, next) {
    response.render('volunteers/apply')
  }
}