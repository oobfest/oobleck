const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/is-logged-in')
const isRole = require('../middleware/is-role')
const submissionModel = require('../submissions/model')
const showsModel = require('../shows/model')
const isProductionEnvironment = require('../utilities/is-production-environment')
const _ = require('lodash')
const util = require('../acts/util')

router.get('/social', isLoggedIn, (request, response, next)=> {
  response.render('acts/social')
})

router.get('/sandbox', isLoggedIn, (request, response, next)=> {
  response.render('acts/sandbox')
})

router.get('/', isLoggedIn, (request, response, next)=> {
  submissionModel.getAllAccepted((error, acts)=> {
    if(error) next(error)
    else {
      acts.sort((a,b)=> {return (a.actName > b.actName) ? 1 : ((b.actName > a.actName) ? -1 : 0);})
      showsModel.getAll((error, shows)=> {
        if(error) next(error)
        else response.render('acts/view-all', {acts, shows})
      })
    }
  })
})

router.get('/act/:domain', isLoggedIn, (request, response, next)=> {
  let domain = request.params.domain
  submissionModel.getByDomain(domain, (error, act)=> {
    if(error) next(error)
    else response.render('acts/view', {act})
  })
})

router.get('/create', isLoggedIn, (request, response, next)=> {
  response.render('acts/create')
})

router.post('/create', isLoggedIn, (request, response, next)=> {

  let submission = util.formatSubmissionObject(request)
  submission.paymentInfo = true
  submission.stamp = 'in'
  submission.confirmed = true
  submission.invited = true

  submissionModel.create(submission, (error, savedSubmission)=> {
    if(error) next(error)
    else response.redirect('/act/' + savedSubmission.domain)
  })
})

router.get('/create-public', (request, response, next)=> {
  response.render('acts/create-public')
})

router.post('/create-public', (request, response, next)=> {

  let submission = util.formatSubmissionObject(request)

  // Since this path is for invited acts, we automatically mark the following
  submission.paymentInfo = true
  submission.stamp = 'in'
  submission.confirmed = true
  submission.invited = true

  submissionModel.create(submission, (error, savedSubmission)=> {
    if(error) next(error)
    else response.render('acts/create-public-thank-you', {submissionId: savedSubmission._id})
  })
})


module.exports = router
