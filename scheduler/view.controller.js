
module.exports = {

	index: function(request, response, next) {
		response.render('scheduler/submissions')
	},

	schedule: function(request, response, next) {
		response.render('scheduler/schedule')
	},

	scheduleOld: function(request, response, next) {
		response.render('scheduler/schedule-old')
	}
}