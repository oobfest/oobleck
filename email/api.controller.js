const model = require('./model')

module.exports = {
  sendContactEmail: function(request, response, next) {
    let email = request.body.email
    let name = request.body.name
    let subject = request.body.subject
    let message = request.body.message
    model.sendContactEmail(email, name, subject, message, (error, info)=> {
      if(error) next(error)
      else {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        response.json(info)
      }
    })
  }
}