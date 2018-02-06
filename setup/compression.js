const log = require('winston')

module.exports = async function(app) {
	
	// Dependencies
	const compression = require('compression')

	// Setup
	app.use(compression())

	// Log
	log.info("✅  GZip Compression")
}

// NOTE
// For a high-traffic website in production, 
// the best way to put compression in place is to implement it at a reverse proxy level. 
// In that case, you do not need to use compression middleware. 
// For details on enabling gzip compression in Nginx, see Module "ngx_http_gzip_module" in the Nginx documentation.
// https://expressjs.com/en/advanced/best-practice-performance.html#use-a-reverse-proxy