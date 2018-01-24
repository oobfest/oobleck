// AWS stuff
var aws = require('aws-sdk')
aws.config.region = 'us-east-2'
const S3 = new aws.S3()
const S3_BUCKET = process.env.AWS_BUCKET_NAME

// Retrieve a signed request from the app with which the image can be PUT to S3
router.get('/image-upload-request', (request, response) => {
	const fileName = request.query['file-name']
	const fileType = request.query['file-type']
	const s3Parameters = {
		Bucket: S3_BUCKET,
		Key: fileName,
		Expires: 60,
		ContentType: fileType,
		ACL: 'public-read'
	}
	S3.getSignedUrl('putObject', s3Parameters, (error, data) => {
		if(error) {
			console.log(error)
			return res.end()
		}
		const returnData = {
			signedRequest: data,
			url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
		}
		response.write(JSON.stringify(returnData))
		response.end()
	})
})