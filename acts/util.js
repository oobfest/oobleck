const limax = require('limax')

module.exports = {
  formatSubmissionObject(request) {
    return { 
      id: request.body['submission-id'],
      actName: request.body['act-name'],
      domain: limax(request.body['act-name']),
      showType: request.body['show-type'],
      informalDescription: request.body['informal-description'],
      publicDescription: request.body['public-description'],
      accolades: request.body['accolades'],
      country: request.body['country'],
      city: request.body['city'],
      state: request.body['state'],
      homeTheater: request.body['home-theater'],
      primaryContactName: request.body['primary-contact-name'],
      primaryContactEmail: request.body['primary-contact-email'],
      primaryContactPhone: request.body['primary-contact-phone'],
      primaryContactRole: request.body['primary-contact-role'],
      primaryContactAttending: (request.body['primary-contact-attending'].toLowerCase() == 'yes'),
      minimumShowLength: request.body['minimum-show-length'],
      maximumShowLength: request.body['maximum-show-length'],
      specialNeeds: request.body['special-needs'],
      imageUrl: request.body['image-url'],
      deleteImageUrl: request.body['delete-image-url'],
      videoUrls: [
        request.body['video-url-0'],
        request.body['video-url-1'],
        request.body['video-url-2']
      ],
      videoInfo: request.body['video-info'],
      available: request.body['available'],
      conflicts: this.flattenConflicts(
        request.body['conflict-act'],
        request.body['conflict-person']
      ),

      additionalMembers: this.flattenPersonnel(
        request.body['personnel-name'], 
        request.body['personnel-email'], 
        request.body['personnel-role'],
        request.body['personnel-attending']
      ),

      socialMedia: this.flattenSocialMedia(
        request.body['social-media-type'],
        request.body['social-media-url']
      )
    }
  },

  flattenSocialMedia(socialMediaTypes, socialMediaUrls) {
    if (socialMediaTypes) {
      let socialMedia = []
      for(let i=0; i<socialMediaTypes.length; i++) {
        socialMedia.push({
          type: socialMediaTypes[i],
          url: socialMediaUrls[i]
        })
      }
      return socialMedia
    }
    return []
  },

  flattenPersonnel(personnelNames, personnelEmails, personnelRoles, personnelAttending) {
    if(personnelNames) {
      let personnel = []
      for(let i=0; i<personnelNames.length; i++) {
        personnel.push({
          name: personnelNames[i],
          email: personnelEmails[i],
          role: personnelRoles[i],
          attending: (personnelAttending[i].toLowerCase() == 'yes')
        })
      }
      return personnel
    }
    return []
  },

  flattenConflicts(conflictActs, conflictPersons) {
    if(conflictActs) {
      let conflicts = []
      for(let i=0; i<conflictActs.length; i++) {
        conflicts.push({
          act: conflictActs[i],
          person: conflictPersons[i]
        })
      }
      return conflicts
    }
    return []
  }
}
