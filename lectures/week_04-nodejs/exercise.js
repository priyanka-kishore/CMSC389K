/*
    1.	Create an express server in index.js found in the in-class lecture folder for week 4
    2.	When a user visits localhost:8888/week4, create an object that has two items:
    a.	An array of your group member’s name(s)
    b.	An array of urls that links to a picture of the respective person’s favorite food.
    3.	The names should have key “names” and foods should have key “foods” 
    a.	EXAMPLE: {names: [“Benny”, “Chirag”], 
    foods: [“http”://image.com/benny.jpg”, “http://image.com/chirag.jpg”]}
    4.	Use `res.end(util.format(YOUR_OBJECT))` when you are ready to send the data
*/

var http = require('http');

const PORT = 8888; // what's a port? an endpoint to send application to

function handleReq(req, res) {
	console.log("New request at " + req.url);

	if (req.url === '/week4') {
		var OBJ = {
			names: ["Benny", "Chirag"],
            foods: ["https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.splendidtable.org%2Frecipes%2Famerican-french-fries&psig=AOvVaw1s3M8BpaOHAs5ZdmCv1xwA&ust=1582390152923000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCOCvv4CN4-cCFQAAAAAdAAAAABAD",
                    "https://www.seriouseats.com/recipes/images/2015/07/20150728-homemade-whopper-food-lab-35-1500x1125.jpg"]
		};
        res.end(util.format(OBJ));
	} else {
		res.end("Link hit: " + req.url);
	}
}

var server = http.createServer(handleReq); // using http package, create a server to handle this request

server.listen(PORT, function() {
	console.log("Server listening on: http://localhost:%s", PORT);
})