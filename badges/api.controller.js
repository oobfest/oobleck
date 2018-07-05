const model = require('./model')

module.exports = {
  
  getAll: function(request, response, next) {
    model.getAll((error, badges)=> {
      if(error) next(error)
      else response.json(badges)
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