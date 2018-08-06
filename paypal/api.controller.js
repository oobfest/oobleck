let paypalModel = require('./model')
let showModel = require('../shows/model')
let badgeModel = require('../badges/model')
let workshopModel = require('../workshops/model')
let emailModel = require('../email/model')

module.exports = {

  cors: function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*")
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    response.json({yay: true})
  },


  createTicketSale: function(request, response, next) {
    let showId = request.params.id
    let ticket = request.body
    ticket.quantity = Number(ticket.quantity)
    paypalModel.createTicketSale(showId, ticket, (error, payment)=> {
      if(error) next(error)
      else {
        response.header("Access-Control-Allow-Origin", "*")
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        payment.tyler = 'HELLO!'
        response.json(payment)        
      }
    })
  },

  createWorkshopSale: function(request, response, next) {
    let name = request.body.name
    let quantity = request.body.quantity
    let auditing = request.body.auditing == 'true'
    let price = auditing ? 15 : 55
    paypalModel.createWorkshopSale(name, price, quantity, auditing, (error, payment)=> {
      if(error) next(error)
      else {
        response.header("Access-Control-Allow-Origin", "*")
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        response.json(payment)
      }
    })
  },

  executeWorkshopSale: function(request, response, next) {
    let paymentId = request.body.paymentId
    let payerId = { "payer_id": request.body.payerId }

    paypalModel.executeSale(paymentId, payerId, (error, payment)=> {
      if(error) next(error)
      else {
        let newStudent = {
          name: request.body.name,
          email: request.body.email,
          phone: request.body.phone,
          quantity: request.body.quantity,
          auditing: request.body.auditing == 'true',
          payment: payment
        }
        let domain = request.body.domain
        workshopModel.addStudent(newStudent, domain, (error, workshop)=> {
          if(error) next(error)
          else {
            response.header("Access-Control-Allow-Origin", "*")
            response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            response.json({message: "Success!"})            
          }
        })
      }
    })
  },


  executeTicketSale: function(request, response, next) {
    let showId = request.params.id
    let paymentId = request.body.paymentId
    let payerId = { "payer_id": request.body.payerId }
    let ticket = request.body.ticket

    // TODO: confirm & mark not sold out
    paypalModel.executeSale(paymentId, payerId, (error, payment)=> {
      if(error) next(error)
      else {
        showModel.ticketReservation(showId, ticket.name, ticket.email, ticket.phone, ticket.quantity, false, payment, (error, status)=>{
          if(error) next(error)
          else {
            response.header("Access-Control-Allow-Origin", "*")
            response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            response.json(payment)            
          }
        })
      }
    })
  },

  createBadgeAllSale: function(request, response, next) {
    let quantity = request.body.quantity
    let price = 99
    paypalModel.createBadgeAllSale(price, quantity, (error, payment)=> {
      if(error) next(error)
      else {
        response.header("Access-Control-Allow-Origin", "*")
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        response.json(payment)
      }
    })
  },

  executeBadgeAllSale: function(request, response, next) {

    let paymentId = request.body.paymentId
    let payerId = { "payer_id": request.body.payerId }
    let name = request.body.name
    let email = request.body.email
    let phone = request.body.phone
    let quantity = request.body.quantity

    paypalModel.executeSale(paymentId, payerId, (error, payment)=> {
      if(error) next(error)
      else {
        let newBadge = {
          name: name,
          email: email,
          phone: phone,
          type: "all",
          quantity: quantity,
          payment: payment
        }
        badgeModel.create(newBadge, (error, savedBadge)=> {
          if(error) next(error)
          else {
            let firstSentence = "Thank you for purchasing an Out of Bounds Festival badge! This means you get to reserve tickets to as many shows as you want throughout the entire week."
            emailModel.sendBadgeEmail(firstSentence, savedBadge.email)
            response.header("Access-Control-Allow-Origin", "*")
            response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            response.json({message: "Success!"})
          }
        })
      }
    })
  },

  createPerformerBadgeSale: function(request, response, next) {
    let weekendOnly = request.body.weekendOnly === 'true'
    paypalModel.createPerformerBadgeSale(weekendOnly, (error, payment)=> {
      if(error) next(error)
      else {
        response.header("Access-Control-Allow-Origin", "*")
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        response.json(payment)
      }
    })
  },

  executePerformerBadgeSale: function(request, response, next) {

    let paymentId = request.body.paymentId
    let payerId = { "payer_id": request.body.payerId }
    let name = request.body.name
    let email = request.body.email
    let phone = request.body.phone
    let weekendOnly = request.body.weekendOnly == 'true'

    paypalModel.executeSale(paymentId, payerId, (error, payment)=> {
      if(error) next(error)
      else {
        let newBadge = {
          name: name,
          email: email,
          phone: phone,
          type: weekendOnly ? "performer-weekend-upgrade" : "performer-full-upgrade",
          quantity: 1,
          payment: payment
        }
        badgeModel.create(newBadge, (error, savedBadge)=> {
          if(error) next(error)
          else {
            let firstSentence = weekendOnly
              ? "Thank you for upgrading your performer badge for the Out of Bounds Festival! With the weekend-only upgrade you are able to reserve a ticket for as many shows as you'd like, Friday through Monday."
              : "Thank you for upgrading your performer badge for the Out of Bounds Festival! This means you get to reserve a ticket for as many shows as you want throughout the entire week."
            emailModel.sendBadgeEmail(firstSentence, savedBadge.email)
            response.header("Access-Control-Allow-Origin", "*")
            response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            response.json({message: "Success!"})
          }
        })
      }
    })
  },


  executeSale: function(request, response, next) {
    let paymentId = request.body.paymentID
    let paymentData = { "payer_id": request.body.payerID }
    paypalModel.executeSale(paymentId, paymentData, (error, payment)=> {
      if(error) next(error)
      else response.json(payment)
    })
  }
}