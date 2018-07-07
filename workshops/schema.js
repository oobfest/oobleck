const mongoose = require('mongoose')
const Mixed = mongoose.Schema.Types.Mixed

let workshopSchema = mongoose.Schema({
  name: String,
  description: String,
  teacher: String,
  bio: String,
  affiliation: String,
  imageUrl: String,
  deleteImageUrl: String,

  day: String,
  venue: String,
  time: String,

  capacity: Number,
  students: [{
    email: String,
    quantity: Number,
    auditing: Boolean,
    payment: {}
  }]

})

let Workshop = mongoose.model('Workshop', workshopSchema)

module.exports = Workshop