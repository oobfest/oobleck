const log = require('winston')

module.exports = async function(app) {
  
  // Dependencies
  let paypalSdk = require('paypal-rest-sdk')
  let isProductionEnvironment = require('../utilities/is-production-environment')

  // Setup
  if (isProductionEnvironment) {
    paypalSdk.configure({
        'mode': 'live',
        'client_id': process.env.PAYPAL_CLIENT,
        'client_secret': process.env.PAYPAL_SECRET,
    })  
  }
  else {
    paypalSdk.configure({
        'mode': 'sandbox',
        'client_id': process.env.PAYPAL_SANDBOX_CLIENT,
        'client_secret': process.env.PAYPAL_SANDBOX_SECRET,
    })  
  }

  // Log
  let message = "✅  PayPal Config " + (isProductionEnvironment ? "(Live)" : "(Sandbox)")
  log.info(message)
}