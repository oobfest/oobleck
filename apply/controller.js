module.exports = {
	
	apply: function(request, response) {
		response.render('apply/first-page', { 
			recaptcha: true, 
			hotjar: true,
			trackPage: true,
			submission: {available: []}, 
			socialMedia: [], 
			personnel: []
		})
	},

	apply2: function(request, response, next) {

	},

	hosting: function(request, response, next) {
		response.render('apply/host-application', { 
			recaptcha: true, 
			hotjar: true, 
			trackPage: true 
		})
	},


}