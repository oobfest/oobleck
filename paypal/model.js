let paypalSdk = require('paypal-rest-sdk')
let showModel = require('../shows/model')

module.exports = {
  
  createWorkshopSale: function(workshopName, price, quantity, callback) {
    let total = price * quantity
    let paymentData = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: { return_url: "http://oobfest.com/workshops", cancel_url: "http://oobfest.com/workshops" },
      transactions: [{
        item_list: { 
          items: [{
            name: "Workshop",
            sku: "workshop",
            price: price,
            currency: "USD",
            quantity: quantity
          }]
        },
        amount: { currency: "USD", total: total },
        description: "Workshop: " + workshopName,
      }]
    }

    this.createCheckoutExperienceProfile((experienceProfileId)=> {
      paymentData.experience_profile_id = experienceProfileId
      paypalSdk.payment.create(paymentData, (error, payment)=> {
        callback(error, payment)
      })
    })

  },

  createTicketSale: function(showId, ticket, callback) {
    callback(null, null)
  },

  createBadgeAllSale: function(price, quantity, callback) {
    let total = price * quantity
    let paymentData = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: { return_url: "http://oobfest.com/badges", cancel_url: "http://oobfest.com/badges" },
      transactions: [{
        item_list: { 
          items: [{
            name: "All-Access Badge",
            sku: "bdg-all",
            price: price,
            currency: "USD",
            quantity: quantity
          }]
        },
        amount: { currency: "USD", total: total },
        description: "All-Access Badge for Out of Bounds 2018",
      }]
    }
    
    //paymentData.experience_profile_id = "XP-49QE-GA2W-CHMC-L2H3"

    this.createCheckoutExperienceProfile((experienceProfileId)=> {
      paymentData.experience_profile_id = experienceProfileId
      paypalSdk.payment.create(paymentData, (error, payment)=> {
        callback(error, payment)
      })
    })
  },

  createPerformerBadgeSale: function(weekendOnly, callback) {
    // Remember: you only buy one performer badge at a time
    let item = weekendOnly
      ? { name: "Performer Badge Weekend Only", sku: "bdg-pfmr-wknd",  price: 45, currency: "USD", quantity: 1 }
      : { name: "Performer Badge Full-Week",    sku: "bdg-prfmr-full", price: 69, currency: "USD", quantity: 1 }
    let paymentData = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: { return_url: "http://oobfest.com/badges", cancel_url: "http://oobfest.com/badges" },
      transactions: [{
        item_list: { 
          items: []
        },
        amount: { currency: "USD", total: weekendOnly ? 45 : 69 },
        description: weekendOnly ? "Weekend-Only Performer Pass Upgrade" : "Full-Week Performer Pass Upgrade",
      }]
    }

    this.createCheckoutExperienceProfile((experienceProfileId)=> {
      paymentData.experience_profile_id = experienceProfileId
      paypalSdk.payment.create(paymentData, (error, payment)=> {
        callback(error, payment)
      })
    })
  },

  createCheckoutExperienceProfile: function(callback) {
    let checkoutExperience = {
        "name": Math.random().toString(36).substring(2),
        "temporary": true,
        "presentation": {
            "brand_name": "Out of Bounds Comedy Festival",
            //"logo_image": "https://app.oobfest.com/img/logo.png",
            "locale_code": "US"
        },
        "input_fields": {
            "no_shipping": 1,
        }
    }
    paypalSdk.webProfile.create(checkoutExperience, function (error, webProfile) {
      if(error) callback(error)
      else callback(webProfile.id)
    })
  },

  executeSale: function(paymentId, paymentData, callback) {
    paypalSdk.payment.execute(paymentId, paymentData, function(error, payment) {
      if(error) next(error)
      callback(error, payment)
    })
  }
}