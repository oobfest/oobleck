const mongoose = require('mongoose')

let badgeSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  quantity: Number,

  // Badge Types: all, performer-weekend, performer-all
  type: String,

  payment: {},
  reservations: {}
})

let Badge = mongoose.model('Badge', badgeSchema)

module.exports = Badge