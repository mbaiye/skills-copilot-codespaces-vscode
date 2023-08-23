// Create web server
var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var url = require('url');
var path = require('path');

var comments = [];

// Create server
http.createServer(function(req, res) {
	// Parse the URL into its component parts
	var url_parts = url.parse(req.url);
	// Get the pathname (URL without host and port)
	var path = url_parts.pathname;

	switch(path) {
		case '/':
			fs.readFile('./index.html', function(err, data) {
				if(err) {
					res.writeHead(404, {'Content-Type': 'text/plain'});
					res.end('404 - Page not found.');
				}
				else {
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.end(data);
				}
			});
			break;
		case '/comments':
			if(req.method == 'POST') {
				var reqBody = '';
				req.on('data', function(data) {
					reqBody += data;
				});
				req.on('end', function() {
					var comment = qs.parse(reqBody);
					comments.push(comment);
					console.log(comments);
				});
			}
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(JSON.stringify(comments));
			break;
		default:
			res.writeHead(404, {'Content-Type': 'text/plain'});
			res.end('404 - Page not found.');
			break;
	}
}).listen(8080);
console.log('Server running on port 8080.');