let paypalSdk = require('paypal-rest-sdk')

paypalSdk.configure({
    'mode': 'sandbox',
    'client_id': process.env.PAYPAL_SANDBOX_CLIENT,
    'client_secret': process.env.PAYPAL_SANDBOX_SECRET,
})

let checkoutExperience = {
    "name": Math.random().toString(36).substring(2),
    "temporary": true,
    "presentation": {
        "brand_name": "Out of Bounds Comedy Festival",
        "logo_image": "https://app.oobfest.com/img/logo.png",
        "locale_code": "US"
    },
    "input_fields": {
        "no_shipping": 1,
    }
}

module.exports = {
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

    this.createCheckoutExperienceProfile((error, experienceProfileId)=> {
      if(error) callback(error)
      else {
        paymentData.experience_profile_id = experienceProfileId
        paypalSdk.payment.create(paymentData, (error, payment)=> {
          callback(error, payment)
        })
      }
    })
  },

  createCheckoutExperienceProfile: function(callback) {
    paypalSdk.webProfile.create(checkoutExperience, function (error, webProfile) {
      console.log("Profile", webProfile)
      callback(error, webProfile.id)
    })
  },

  executeSale: function(paymentId, paymentData, callback) {
    paypalSdk.payment.execute(paymentId, paymentData, function(error, payment) {
      if(error) next(error)
      callback(error, payment)
    })
  }
}