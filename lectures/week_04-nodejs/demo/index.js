/*var http = require("http")
const PORT = 8888;

function handleReq(req, res) {
	console.log("New request at " + req.url)
	if (req.url === '/robert') {
		var robert = {
			age: 21,
			gender: 'male',
			majors: ['Computer Science']
		};
		res.end(JSON.stringify(robert));
	} else {
		res.end("link hit: " + req.url);
	}
}

var server = http.createServer(handleReq)

server.listen(PORT, function() {
	console.log("Server is listening on: http://localhost:" + PORT);
})*/


/* READING FILE
var fs = require("fs");
fs.readFile('input.txt', function(err, data) { // does not wait to finish reading before executing old lines
	if (err) {
		return console.error(err);
	}
	console.log("1. Asynchronous read: " + data);
}); // reading in file called input.txt

var data = fs.readFileSync('input.txt'); // must finish reading before executing next lines
console.log("2. Synchronous read: " + data);
console.log("3. Program Ended.");
*/

/* WRITING FILE
var fs = require("fs");
fs.writeFile('output.txt', 'Hello output file!', function(err) {
	if (err) { 
		return console.error(err); 
	}

	fs.readFile('output.txt', function(err, data) {
		if (err) { 
			return console.error(err); 
		}
		console.log("Asynchronous read: " + data);
	});
});
*/


/* REQUEST SERVER
var request = require('request');
request('http://api.umd.io/v0/courses/cmsc132', function(err, response, body) {
	if (!err && response.statusCode == 200) {
		console.log(response);
	}
})
*/

// CREATE A SERVER. 
/* What's a server? Waits for request, then sends a response.
var http = require('http');

const PORT = 8888; // what's a port? an endpoint to send application to

function handleReq(req, res) {
	console.log("New request at " + req.url);

	if (req.url === '/priyanka') {
		var priyanka = {
			age: 19,
			gender: 'f',
			majors: ['cs', 'stat']
		};
		res.end(JSON.stringify(priyanka));
	} else {
		res.end("Link hit: " + req.url);
	}
}

var server = http.createServer(handleReq); // using http package, create a server to handle this request

server.listen(PORT, function() {
	console.log("Server listening on: http://localhost:%s", PORT);
})
*/