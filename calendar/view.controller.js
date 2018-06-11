
module.exports = {

	index: function(request, response, next) {
		response.render('calendar/calendar')
	},

	schedule: function(request, response, next) {
		response.render('scheduler/schedule')
	},

	scheduleOld: function(request, response, next) {
		response.render('scheduler/schedule-old')
	}
}