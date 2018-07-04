const model = require('./model')

module.exports = {

  viewAll: function(request, response, next) {
    model.getAll((error, badges)=> {
      console.log(badges)
      if(error) next(error)
      else response.render('badges/view-all', { badges })
    })
  }
  
}