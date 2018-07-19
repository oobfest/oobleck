const model = require('./model')

module.exports = {
  
  getAll: function(request, response, next) {
    model.getAll((error, badges)=> {
      if(error) next(error)
      else response.json(badges)
    })
  },

  create: function(request, response, next) {
    let badge = request.body
    model.create(badge, (error, savedBadge)=> {
      if(error) next(error)
      else response.json(savedBadge)
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