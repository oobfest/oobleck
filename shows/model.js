const Show = require('./schema')
var _ = require('lodash')
let badgesModel= require('../badges/model')
let mongoose = require('mongoose')
let submissionModel = require('../submissions/model')
let limax = require('limax')

let publicFields = "_id day venue time capacity remaining acts host"

module.exports = {

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
				let updatedShow = newShow
				this.save(updatedShow, (error, savedShow)=> {
					callback(error, savedShow)
				})
			}
		})
	},

	updateDuration: function(showId, actId, duration, callback) {
		this.get(showId, (error, show)=> {
			if(error) callback(error)
			else {
				let index = show.acts.findIndex(a=> a._id == actId)
				show.acts[index].duration = duration
				show.markModified('acts') 
				show.save((error, savedShow)=> {
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

	addAct: function(showId, actId, callback) {
		this.get(showId, (error, show)=> {
			if(error) callback(error)
			else {
				submissionModel.get(actId, (error, submission)=> {
					if(error) next(error)
					else {
						let act = {
							_id: submission._id,
							name: submission.actName,
							type: submission.showType,
							duration: null,
							imageUrl: submission.imageUrl.substr(0, submission.imageUrl.length-4),
							domain: submission.domain,
							description: submission.publicDescription
						}
						show.acts.push(act)
						this.update(showId, show, (error, savedShow)=> {
							if(error) next(error)
							else callback(null, savedShow)
						})
					}
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

	publish: function(callback) {
		this.getAll((error, shows)=> {
		  submissionModel.getAllAccepted((error, submissions)=> {
		  	if(error) console.log(error)
		  	else {
			    for(let i=0; i<shows.length; i++) {
			      for(let j=0; j<shows[i].acts.length; j++) {
			        let domain = limax(shows[i].acts[j].name)
			        let submission = submissions.find(s=> s.domain == domain)
			        shows[i].acts[j].imageUrl = submission.imageUrl.substr(0, submission.imageUrl.length-4)
			        shows[i].acts[j].description = submission.publicDescription
			      }
			      shows[i].markModified('acts')
			      shows[i].save(function(error, savedShow) {
			        if(error) callback(error)
			      })
			    }
			    callback(null)
		  	}
		  })
		})
	},

	// TODO: payPalReservation

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
							_id: mongoose.Types.ObjectId(),
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

								// Reserving non-weekend day with weekend badge
								if (badge.type == 'performer-weekend-upgrade' && (show.day == 'Tuesday' || show.day=='Wednesday' || show.day=='Thursday')) {
									// Todo: assumes they've only bought one badge
									callback(null, {reservationSuccessful: false, message: "Badge can only reserve shows on Friday, Saturday, Sunday or Monday"})
								}

								// Show is sold out
								else if(show.remaining <= 0 ) {
									callback(null, {reservationSuccessful: false, message: "Show is sold out"})
								}

								// Asking for more tickets than show has left
								else if (quantity > show.remaining) {
									callback(null, {reservationSuccessful: false, message: `There are less than ${quantity} tickets available for this show`})
								}

								// Has already reserved tickets up to the quantity on the badge
								else if (show.tickets.filter(t=> t.email == badge.email).map(t=> t.quantity).reduce((total, quantity)=> total + quantity, 0) >= badge.quantity) {
									// Todo: assumes they've only bought one badge D:
									callback(null, {reservationSuccessful: false, message: `${badge.email} has already made ${badge.quantity} reservation(s) for this show`})
								}

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