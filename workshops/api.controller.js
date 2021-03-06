let model = require('./model')
let limax = require('limax') 

module.exports = {

  create: function(request, response, next) {
    let workshop = request.body
    workshop.domain = limax(workshop.name)
    workshop.sold = 0
    workshop.auditSold = 0
    model.create(workshop, (error, saved)=> {
      if(error) next(error)
      else response.json(saved)
    })
  },

  getAll: function(request, response, next) {
    model.getAll((error, workshops)=> {
      if(error) next(error)
      else response.send(workshops)
    })
  },

  getAllPublic: function(request, response, next) {
    model.getAllPublic((error, workshops)=> {
      if(error) next(error)
      else response.send(workshops)
    })
  },

  getById: function(request, response, next) {
    let id = request.params.id
    model.get(id, (error, workshop)=> {
      if(error) next(error)
      else response.send(workshop)
    })
  },

  getByDomain: function(request, response, next) {
    let domain = request.params.domain
    model.getByDomain(domain, (error, workshop)=> {
      if(error) next(error)
      else response.send(workshop)
    })
  },

  update: function(request, response, next) {
    let id = request.params.id
    let workshop = request.body

    workshop.auditSold = 0
    workshop.sold = 0
    for(let student of workshop.students) {
      if(!student.refunded) {
        if(student.auditing) workshop.auditSold += Number(student.quantity)
        else workshop.sold += Number(student.quantity)
      }
    }

    model.update(id, workshop, (error, workshop)=> {
      if(error) next(error)
      else response.json(workshop)
    })
  },

  setDate: function(request, response, next) {
    let id = request.params.id
    let newDates = request.body
    model.setDate(id, newDates, (error, savedWorkshop)=> {
      if(error) next(error)
      else response.json(savedWorkshop)
    })
  },

  deleteDate: function(request, response, next) {
    let id = request.params.id
    let newDates = {
      day: "",
      venue: "",
      time: ""
    }
    model.setDate(id, newDates, (error, savedWorkshop)=> {
      if(error) next(error)
      else response.json(savedWorkshop)
    })
  },

  delete: function(request, response, next) {
    let id = request.params.id
    model.delete(id, (error)=> {
      if(error) next(error)
      else response.status(204).end()
    })
  },

  setRefund: function(request, response, next) {
    let id = request.params.id
    let email = request.body.email
    let refunded = request.body.refunded
    model.setRefund(id, email, refunded, (error, updatedWorkshop)=> {
      if(error) next(error)
      else response.json(updatedWorkshop)
    })
  },

  getRemaining: function(request, response, next) {
    let id = request.params.id
    model.getRemaining(id, (error, remaining)=> {
      if(error) next(error)
      else {
        response.header("Access-Control-Allow-Origin", "*")
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        response.json(remaining)
      }
    })
  },

  setAuditCapacity: function(request, response, next) {
    let id = request.params.id
    let auditCapacity = Number(request.body.auditCapacity)
    model.setAuditCapacity(id, auditCapacity, (error, workshop)=> {
      if(error) next(error)
      else response.json(workshop)
    })
  }
}