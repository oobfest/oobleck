const model = require('./model')

module.exports = {

  view: function(request, response, next) {
    let id = request.params.id
    model.get(id, (error, workshop)=> {
      if(error) next(error)
      else response.render('workshops/view', {workshop})
    })
  },

  viewAll: function(request, response, next) {
    model.getAll((error, workshops)=> {
      if(error) next(error)
      else response.render('workshops/view-all', { workshops })
    })
  },

  delete: function(request, response, next) {
    let id = request.params.id
    model.delete(id, (error)=> {
      if(error) next(error)
      else response.redirect('workshops')
    })
  }
}