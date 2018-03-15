const model = require('./model')

module.exports = {

	apply: function(request, response, next) {
		response.render('apply/host-application-vue')
	},

	view: function(request, response, next) {
		let id = request.params.id
		model.get(id, (error, host)=> {
			if(error) next(error)
			else response.render('hosts/view', {host: host})
		})
	},

	viewAll: function(request, response, next) {
		model.getAll((error, hosts)=> {
			if(error) next(error)
			else response.render('hosts/view-all', { hosts: hosts })
		})
	},

	create: function(request, response, next) {
		let host = request.body
		model.create(host, (error, newHost)=> {
			if(error) next(error)
			else response.render('apply/thank-you-host', { host: newHost })
		})
	},

	delete: function(request, response, next) {
		let id = request.params.id
		model.delete(id, (error)=> {
			if(error) next(error)
			else response.redirect('hosts')
		})
	}
}