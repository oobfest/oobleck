const Workshop = require('./schema')
var _ = require('lodash')

let publicFields = "name domain description teacher bio affiliation imageUrl day venue time capacity sold auditCapacity auditSold"

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
        workshop.markModified('students')
        
        if(student.auditing) {
          workshop.auditSold += student.quantity
        } 
        else {
          workshop.sold += student.quantity
        }

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
  },

  setRefund: function(id, email, refunded, callback) {
    this.get(id, (error, workshop)=> {
      if(error) callback(error)
      else {
        let index = workshop.students.map(s=> s.email).indexOf(email)
        workshop.students[index].refunded = refunded
        if(refunded) {
          workshop.remaining += workshop.students[index].quantity
          if(workshop.refunded == undefined) workshop.refunded = 1
          else workshop.refunded++
        }
        else {
          workshop.remaining -= workshop.students[index].quantity
          workshop.refunded--
        }
        workshop.markModified('students')
        this.save(workshop, (error, savedWorkshop)=> {
          callback(error, savedWorkshop)
        })
      }
    })
  },

  getRemaining: function(id, callback) {
    this.get(id, (error, workshop)=> {
      if(error) callback(error)
      else {
        callback(null, {sold: workshop.sold, auditSold: workshop.auditSold})
      }
    })
  },

  setAuditCapacity: function(id, auditCapacity, callback) {
    this.get(id, (error, workshop)=> {
      if(error) callback(error)
      else {

        if(workshop.auditRemaining == undefined) {
          workshop.auditRemaining = auditCapacity
        }
        else {
          let auditCount = workshop.auditCapacity - workshop.auditRemaining
          workshop.auditRemaining = auditCapacity - auditCount
        }

        workshop.auditCapacity = auditCapacity
        
        this.save(workshop, (error, savedWorkshop)=> {
          callback(error, savedWorkshop)
        })
      }
    })
  }

}