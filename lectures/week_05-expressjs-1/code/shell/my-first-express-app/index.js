/*** SERVER STUFF ***/
var express = require('express');
var server = express(); // creates the server into this variable

// modules
var operations = require('./operations');

// query parameters
server.get('/factorial', function(req, res) {
    let number = req.query.number; // we are ASSUMING that url will have this query param
    res.send(`factorial(${number}): ` + operations.factorial(number)); // prints query param value
})

// creating endpoints tailored to our Operations module using query params
server.get('/sqroot', function(req, res) {
    let number = req.query.number;
    res.send(`sqroot(${number}): ` + operations.sqroot(number)); // prints query param value
})

server.get('/square', function(req, res) {
    let number = req.query.number;
    res.send(`square(${number}): ` + operations.square(number)); // prints query param value
})

// add endpoint to define. req = request (name of path). res 
server.get('/', function(req, res) {
    // block of code to execute at this endpoint
    let x = operations.sqroot(25);
    let y = operations.factorial(5);
    let z = operations.square(4);
    res.send('Hello world, this is the home page.' + x + " " + y + " " + z); // sends text to display on HTML page
})

server.get('/route1', function(req, res) { // another endpoint
    res.send('hello world, this is ' + req.path);
})

// root parameters = don't need a get request for each individual function
server.get('/operations/:op', function(req, res) {
    let operation = req.params.op; // capture whats in the placeholder
    let number = req.query.number; // asume a query has been entered

    // error handling
    if (!operations[operation]) { res.send('not a valid operation'); } // will exit out if sent
    if (!number) { res.send('please send a number'); }

    // since Operations is an object, can query which query using [] since operation is a key, then pass in num
    res.send(`the ${operation} of ${number} is: ${operations[operation](number)}`);
})

server.listen(3000, function() {
    console.log("Server listening on port 3000");
})

/**
 * ENDPOINTS
 * When we type in URL, we are making a GET request to server at that specific route.
 */


/** MODULE STUFF **/
/**
 * - creating modules are a way to isolate code into "packages"
 * - can be used in different files, reusability
 * - just a JS file, export function in JS file
 */

 /** QUERY PARAMETERS
  * requests have a path, could have a query (?number=50)
  * like capturing input from URL
  */

/** ROOT PARAMETERS
 * act as placeholders
 * live in the request and capture whatever text is sitting in the placeholder
 * denote a route paramter with a colon followed by name of route param
 * 
 * do some error handling to handle requests that don't exist
 */

