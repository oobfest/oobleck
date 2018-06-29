const model = require('./model')

module.exports = {

  create: function(request, response, next) {
    let workshop = request.body
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

  getById: function(request, response, next) {
    let id = request.params.id
    model.get(id, (error, workshop)=> {
      if(error) next(error)
      else response.send(workshop)
    })
  },

  update: function(request, response, next) {
    let id = request.params.id
    let workshop = request.body
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
  }
}