module.exports = {
	encode: function(string) {
		return Buffer.from(string, 'utf8').toString('base64')
	},
	
	decode: function(string) {
		return Buffer.from(string, 'base64').toString('utf8')
	}
}