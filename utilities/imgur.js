
module.exports = (function(){

	const thumbnailType = Object.freeze({
		SMALL_SQUARE: 		's',
		BIG_SQUARE: 		'b',
		SMALL_THUMBNAIL: 	't',
		MEDIUM_THUMBNAIL: 	'm',
		LARGE_THUMBNAIL: 	'l',
		HUGE_THUMBNAIL: 	'h'
	})

	function convertImageUrl(imgurUrl, thumbnailType) {
		return imgurUrl.substr(0, imgurUrl.length-4) + thumbnailType + imgurUrl.substr(imgurUrl.length-4, s.length)
	}

	return {
		getSmallSquare: 	function(imgurUrl) {return this.convertImgurUrl(imgurUrl, this.thumbnailType.SMALL_SQUARE)},
		getBigSquare: 		function(imgurUrl) {return this.convertImgurUrl(imgurUrl, this.thumbnailType.BIG_SQUARE)},
		getSmallThumbnail: 	function(imgurUrl) {return this.convertImgurUrl(imgurUrl, this.thumbnailType.SMALL_THUMBNAIL)},
		getMediumThumbnail: function(imgurUrl) {return this.convertImgurUrl(imgurUrl, this.thumbnailType.MEDIUM_THUMBNAIL)},
		getLargeThumbnail: 	function(imgurUrl) {return this.convertImgurUrl(imgurUrl, this.thumbnailType.LARGE_THUMBNAIL)},
		getHugeThumbnail: 	function(imgurUrl) {return this.convertImgurUrl(imgurUrl, this.thumbnailType.HUGE_THUMBNAIL)},
	}

})()