const Show = require('./schema')
var _ = require('lodash')
let badgesModel= require('../badges/model')

let publicFields = "_id day venue time capacity remaining acts host"

module.exports = {

	temp: function() {
		this.getAll((error, shows)=> {
			for(let show of shows) {
				show.capacity = 50
				show.remaining = 50
				this.save(show, ()=> {})
			}
		})
		console.log("Set show tickets to 50")
	},

	create: function(show, callback) {
		let newShow = Show(show)
		this.save(newShow, (error, savedShow)=> {
			callback(error, savedShow)
		})
	},

	save: function(show, callback) {
		show.save((error, show)=> {
			callback(error, show)
		})
	},

	get: function(id, callback) {
		Show.findById(id, (error, show)=> {
			callback(error, show)
		})
	},

	getAll: function(callback) {
		Show.find((error, shows)=> {
			callback(error, shows)
		})
	},

	getByActId: function(actId, callback) {
		Show.find({'acts._id': actId}, (error, shows)=> {
			callback(error, shows)
		})
	},

	update: function(id, newShow, callback) {
		this.get(id, (error, oldShow)=> {
			if(error) callback(error)
			else {
				let updatedShow = newShow //_.merge(oldShow, newShow)
				this.save(updatedShow, (error, savedShow)=> {
					callback(error, savedShow)
				})
			}
		})
	},

	updateDuration: function(showId, act, callback) {
		this.get(showId, (error, oldShow)=> {
			if(error) callback(error)
			else {
				let index = oldShow.acts.findIndex(a=> a._id.toString() == act._id)
				oldShow.acts[index] = act
				oldShow.markModified('acts') 
				this.save(oldShow, (error, savedShow)=> {
					callback(error, savedShow)
				})
			}
		})
	},

	delete: function(id, callback) {
		this.get(id, (error, show)=> {
			if(error) callback(error, null)
			show.remove((error, show)=> {
				callback(error, show)
			})
		})
	},

	addAct: function(id, act, callback) {
		this.get(id, (error, show)=> {
			if(error) callback(error)
			else {
				show.acts.push(act)
				this.save(show, (error, savedShow)=> {
					callback(error, savedShow)
				})
			}
		})
	},
	
	getShows: function(callback) {
		Show.find({}, publicFields, (error, shows)=> {
			callback(error, shows)
		})
	},

	getShowById: function(id, callback) {
		Show.findById(id, publicFields, (error, show)=> {
			callback(error, show)
		})
	},

	/*
	addTicket: function(showId, ticket, callback) {
		this.get(showId, (error, show)=> {
			if(error) callback(error)
			else {
				if(show.remaining > ticket.quantity) {
					show.tickets.push(ticket)
					show.remaining-=ticket.quantity
				  show.markModified('tickets')
				  this.save(show, (error, savedShow)=> {
				  	callback(error, savedShow)
				  })					
				}
				else callback(true, {reservationSuccessful: false, message: "SOLD OUT!"})	// TODO: something better
			}
		})
	},*/

	badgeReservation: function(showId, email, quantity, callback) {
		badgesModel.getByEmail(email, (error, badge)=> {
			if(error) callback(error)
			else {
				if(badge == null) callback(null, {reservationSuccessful: false, message: "No badges found for this email"})
				else {
					if (quantity <= 0) callback(null, {reservationSuccessful: false, message: "Invalid quantity: " + quantity})
					if (quantity > badge.quantity) callback(null, {reservationSuccessful: false, message: `Badge only supports up to ${badge.quantity} reservations`})
					else {
						let ticket = {
							_id: badge._id,
							name: badge.name,
							email: badge.email,
							phone: badge.phone,
							quantity: quantity,
							badge: badge.type,
							payment: false
						}
						this.get(showId, (error, show)=> {
							if(error) callback(error)
							else {
								if(show.remaining <= 0 ) callback(null, {reservationSuccessful: false, message: "Show is sold out"})
								else if (quantity > show.remaining) callback(null, {reservationSuccessful: false, message: `There are less than ${quantity} tickets available`})
								// TODO: Check if weekend badge.type == 'performer-weekend'
								else {
									show.tickets.push(ticket)
									show.remaining = (show.remaining - ticket.quantity)
									show.markModified('tickets')
									this.save(show, (error, savedShow)=> {
										if(error) callback(error)
										else callback(null, {reservationSuccessful: true, savedShow})
									})
								}
							}
						})
					}
				}
			}
		})
	},

	removeReservation: function(showId, ticketId, callback) {
		this.get(showId, (error, show)=> {
			if(error) callback(error)
			else {
				let ticketIndex = show.tickets.findIndex(t=> t._id == ticketId)
				show.remaining += show.tickets[ticketIndex].quantity
				show.tickets.splice(ticketIndex, 1)
				show.markModified('tickets')
				this.save(show, (error, savedShow)=> {
					if(error) callback(error)
					else callback(null, savedShow)
				})
			}
		})
	},

	clearTickets: function(id, callback) {
		this.get(id, (error, show)=> {
			if(error) callback(error)
			else {
				console.log(show)
				show.tickets = []
				show.markModified('tickets')
				show.remaining = show.capacity
				this.save((error, show)=> {
					callback(error, show)
				})				
			}
		})
	},

	setCapacity: function(id, capacity, callback) {
		this.get(id, (error, show)=> {
			if(error) callback(error)
			else {
				if (show.capacity == undefined) show.remaining = capacity
				else show.remaining = capacity - (show.capacity - show.remaining)
				show.capacity = capacity
				this.save(show, (error, savedShow)=> {
					callback(error, savedShow)
				})			
			}
		})
	}
	
}