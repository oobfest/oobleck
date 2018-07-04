const Badge = require('./schema')

module.exports = {

  create: function(badge, callback) {
    let newBadge = Badge(badge)
    this.save(newBadge, (error, savedBadge)=> {
      callback(error, savedBadge)
    })
  },

  save: function(badge, callback) {
    badge.save((error, badge)=> {
      callback(error, badge)
    })
  },

  get: function(id, callback) {
    Badge.findById(id, (error, badge)=> {
      callback(error, badge)
    })
  },

  getAll: function(callback) {
    Badge.find((error, badges)=> {
      callback(error, badges)
    })
  },

  update: function(id, newBadge, callback) {
    this.get(id, (error, oldBadge)=> {
      if(error) callback(error)
      else {
        let updatedBadge = _.merge(oldBadge, newBadge)
        this.save(updatedBadge, (error, savedBadge)=> {
          callback(error, savedBadge)
        })
      }
    })
  },

  delete: function(id, callback) {
    this.get(id, (error, badge)=> {
      if(error) callback(error, null)
      badge.remove((error, badge)=> {
        callback(error, badge)
      })
    })
  }

}