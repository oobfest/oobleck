const model = require('./model')

module.exports = {

  viewAll: function(request, response, next) {
    response.render('shows/view-all')
  }

}