const model = require('./model')

module.exports = {

  viewAll: function(request, response, next) {
    response.render('badges/view-all')
  }
  
}