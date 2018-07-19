const mongoose = require('mongoose')

let badgeSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  quantity: Number,

  /* Badge Types: 
      all
      performer-weekend-upgrade
      performer-all
      volunteer
      staff
      industry
  */
  type: String,

  payment: {},
})

let Badge = mongoose.model('Badge', badgeSchema)

module.exports = Badge