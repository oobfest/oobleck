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
    showModel.get(showId, (error, show)=> {
      if(show.remaining <= 0) callback(true, null)
      else {
        let total = show.price * ticket.quantity
        let sku = formatSku(show.day, show.venue, show.time)
        let itemName = formatItemName(show.day, show.venue, String(show.time))

        let paymentData = {
          intent: "sale",
          payer: { payment_method: "paypal" },
          redirect_urls: { return_url: "http://oobfest.com/schedule", cancel_url: "http://oobfest.com/schedule" },
          transactions: [{
            item_list: { 
              items: [{
                name: itemName,
                sku: sku,
                price: show.price,
                currency: "USD",
                quantity: ticket.quantity
              }]
            },
            amount: { currency: "USD", total: total },
            description: "Tickets for the Out of Bounds Comedy Festival",
          }]
        }

        this.createCheckoutExperienceProfile((experienceProfileId)=> {
          paymentData.experience_profile_id = experienceProfileId
          paypalSdk.payment.create(paymentData, (error, payment)=> {
            callback(null, payment)
          })
        })

      }
    })
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
      if(error) callback(error)
      callback(error, payment)
    })
  }
}

let formatSku = function(day, venue, time) {
  return `S-${formatSkuDay(day)}-${formatSkuVenue(venue)}-${time}pm`
}

let formatSkuDay = function(day) {
  switch(day) {
    case 'Tuesday':   return 'Tu'
    case 'Wednesday': return 'W'
    case 'Thursday':  return 'Th'
    case 'Friday':    return 'F'
    case 'Saturday':  return 'Sa'
    case 'Sunday':    return 'Su'
    case 'Monday':    return 'M'
  }
}

let formatSkuVenue = function(venue) {
  switch(venue) {
    case 'Hideout Up':        return 'HD'
    case 'Hideout Down':      return 'HU'
    case 'ColdTowne':         return 'CT'
    case 'Fallout':           return 'F'
    case 'Velveeta':          return 'V'
    case 'Spider House':      return 'SH'
    case 'Institution':       return 'I'
  }
}


let formatItemName = function(day, venue, time) {
  return `Ticket for ${formatItemNameDay(day)}, ${formatItemNameVenue(venue)}, ${formatItemNameTime(time)}`
}

let formatItemNameDay = function(day) {
  switch(day) {
    case 'Tuesday':   return 'Tuesday, August 28th'
    case 'Wednesday': return 'Wednesday, August 29th'
    case 'Thursday':  return 'Thursday, August 30th'
    case 'Friday':    return 'Friday, August 31st'
    case 'Saturday':  return 'Saturday, September 1st'
    case 'Sunday':    return 'Sunday, September 2nd'
    case 'Monday':    return 'Monday, September 3rd'
  }
}

let formatItemNameVenue = function(venue) {
  switch(venue) {
    case 'Hideout Up':        return 'Hideout Theatre (Upstairs)'
    case 'Hideout Down':      return 'Hideout Theatre (Downstairs)'
    case 'ColdTowne':         return 'ColdTowne Theater'
    case 'Fallout':           return 'Fallout Theater'
    case 'Velveeta':          return 'Velveeta Room'
    case 'Spider House':      return 'Spider House Ballroom'
    case 'Institution':       return 'Institution Theater'
  }
}

let formatItemNameTime = function(time) {
  return time.slice(0, time.length-2) + ":" + time.slice(time.length-2) + "pm"
}
