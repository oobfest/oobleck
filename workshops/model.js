const Workshop = require('./schema')
var _ = require('lodash')

let publicFields = "name domain description teacher bio affiliation imageUrl day venue time capacity remaining"

module.exports = {

  create: function(workshop, callback) {
    let newWorkshop = Workshop(workshop)
    this.save(newWorkshop, (error, savedWorkshop)=> {
      callback(error, savedWorkshop)
    })
  },

  save: function(workshop, callback) {
    workshop.save((error, workshop)=> {
      callback(error, workshop)
    })
  },

  get: function(id, callback) {
    Workshop.findById(id, (error, workshop)=> {
      callback(error, workshop)
    })
  },

  getByDomain: function(domain, callback) {
    Workshop.findOne({domain: domain}, (error, workshop)=> {
      callback(error, workshop)
    })
  },

  getAll: function(callback) {
    Workshop.find((error, workshops)=> {
      callback(error, workshops)
    })
  },

  getAllPublic: function(callback) {
    Workshop.find({}, publicFields, (error, workshops)=> {
      callback(error, workshops)
    })
  },

  update: function(id, newWorkshop, callback) {
    this.get(id, (error, oldWorkshop)=> {
      if(error) callback(error)
      else {
        let updatedWorkshop = _.merge(oldWorkshop, newWorkshop)
        this.save(updatedWorkshop, (error, savedWorkshop)=> {
          callback(error, savedWorkshop)
        })
      }
    })
  },

  setDate: function(id, newDate, callback) {
    this.get(id, (error, workshop)=> {
      if(error) callback(error)
      else {
        workshop.day = newDate.day
        workshop.venue = newDate.venue
        workshop.time = newDate.time
        this.save(workshop, (error, savedWorkshop)=> {
          callback(error, savedWorkshop)
        })
      }
    })
  },

  addStudent: function(student, domain, callback)  {
    this.getByDomain(domain, (error, workshop)=> {
      if(error) callback(error)
      else {
        workshop.students.push(student)
        this.save(workshop, (error, savedWorkshop)=> {
          callback(error, savedWorkshop)
        })
      }
    })
  },

  delete: function(id, callback) {
    this.get(id, (error, workshop)=> {
      if(error) callback(error, null)
      workshop.remove((error, workshop)=> {
        callback(error, workshop)
      })
    })
  }

}