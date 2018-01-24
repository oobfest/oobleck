const { check } = require('express-validator/check')

let validationSchema = [
	check('act-name')
		.exists().withMessage("Act name must exist")
		.not().isEmpty().withMessage("Act name cannot be empty")
		.isLength({max: 280}).withMessage("Act name is too long"),
	check('city')
		.exists().withMessage("City missing")
		.not().isEmpty().withMessage("City cannot be empty")
		.isLength({max: 280}).withMessage("City is too long"),
	check('flight-agreement')
		.exists().withMessage("Flight agreement missing")
		.not().isEmpty().withMessage("Flight agreement cannot be empty")
		.isLength({max: 280}).withMessage("Flight agreement is too long"),
	check('informal-description')
		.exists().withMessage("Missing act description")
		.not().isEmpty().withMessage("Act description cannot be empty")
		.isLength({max:1400}).withMessage("Act description is too long"),
	check('primary-contact-email')
		.exists().withMessage("Primary contact email is missing")
		.not().isEmpty().withMessage("Primary contact email cannot be empty")
		.isEmail().withMessage("Primary contact email is invalid")
		.isLength({max:1400}).withMessage("Primary contact email is too long"),
	check('primary-contact-name')
		.exists().withMessage("Primary contact name is missing")
		.not().isEmpty().withMessage("Primary contact name cannot be empty")
		.isLength({max:1400}).withMessage("Primary contact name is too long"),
	check('primary-contact-phone')
		.exists().withMessage("Primary contact phone is missing")
		.not().isEmpty().withMessage("Primary contact phone cannot be empty")
		.isMobilePhone('any').withMessage("Invalid phone number")
		.isLength({max:1400}).withMessage("Email address too long"),
	check('personnel-name.*')
		.isLength({max:280}).withMessage("Personnel name is too long"),
	check('personnel-email.*')
		.not().isEmail().withMessage("Personnel email is invalid")
		.isLength({max:280}).withMessage("Personnel email is too long"),
	check('personnel-role.*')
		.isLength({max:280}).withMessage("Personnel role is too long"),
	check('public-description')
		.exists().withMessage("Public description is missing")
		.not().isEmpty().withMessage("Public description cannot be empty")
		.isLength({max:1400}).withMessage("Public description is too long"),
	check('show-length')
		.exists().withMessage("Show length must exist")
		.not().isEmpty().withMessage("Show length cannot be empty")
		.isNumeric().withMessage("Show length must be numeric"),
	check('show-type')
		.exists().withMessage("Show type must exist")
		.not().isEmpty().withMessage("Show type cannot be empty")
		.isLength({max:140}).withMessage("Show type is too long"),
	check('video-url')
		.exists().withMessage("Video URL must exist")
		.not().isEmpty().withMessage("Video URL cannot be empty")
		.isURL().withMessage("Video URL must be a valid URL")
]

module.exports = validationSchema