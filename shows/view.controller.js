const model = require('./model')

module.exports = {

  viewAll: function(request, response, next) {
    response.render('shows/view-all')
  },

  print: function(request, response, next) {
    let day = request.query.day
    let venue = request.query.venue
    let time = request.query.time
    model.getByDayVenueTime(day, venue, time, (error, show)=> {
      if(error) next(error)
      else if(show == null) response.send(`Show "${day} ${venue} ${time}" not found`)
      else response.render('shows/print-tickets', { 
        day, 
        venue, 
        time, 
        price: show.price,
        capacity: show.capacity, 
        remaining: show.remaining, 
        tickets: show.tickets 
      })
    })
  }
}