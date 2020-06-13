// DEMO: how to create an API that stores movies and reviews

var express = require('express'); // we know this
var bodyParser = require('body-parser'); // we know this
var mongoose = require('mongoose'); // formats data for MongoDB
mongoose.Promise=global.Promise;
var dotenv = require('dotenv'); // allows us to interface with .env file
var Movie = require('./models/Movie'); // allows us to use code from Movie.js file
// var Review = require('./models/Review');
var PORT = 4420;

// Load environment variables
dotenv.config(); // loads .env file
console.log(process.env.MONGODB);
mongoose.connect(process.env.MONGODB); // mongoose connecting to specific MongoDB server we set up
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

// Setup Express App - is a web framework for Node
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// All the following is setting up endpoints:

app.post('/movie', function(req, res) {
    // Create new movie, taking params from POST req as values for schema
    var movie = new Movie({
        title: req.body.title,
        genre: req.body.genre,
        year: parseInt(req.body.year),
        reviews: []
    });

    // Save movie to database
    movie.save(function(err) {
        if (err) throw err;
        return res.send('Succesfully inserted movie.');
    });
});

// gets all movies from database
app.get('/movie', function(req, res) {
    // use Mongoose function `find`
    // search param: {}, so we want all movies given
    Movie.find({}, function(err, movies) { // callback func: once we find movies, what do we do
        if (err) throw err;
        res.send(movies);
    });
});

// remove movie by id from database
app.delete('/movie/:id', function(req, res) {
    // Find movie by id, using Mongoose/MongoDB function `find`
    Movie.findByIdAndRemove(req.params.id, function(err, movie) {
        if (err) throw err;

        if(!movie){return res.send('No movie with that id');}
        res.send('Movie deleted!');
    });
});

// adding a review based on given ID
app.post('/movie/:id/review', function(req, res) {
    // 1: Find the given movie, using mongoose func `findOne`
    Movie.findOne({ _id: req.params.id },function(err,movie){
        if (err) throw err;
        if (!movie) return res.send('[add review] No movie found with that ID.');

        // 2: Creating the review schema using given params in post request
        movie.reviews.push({
            rating: parseFloat(req.body.rating),
            comment: req.body.comment,
            author: req.body.author
        });

         // 3: Saving the updated movie to database
        movie.save(function(err) {
            if (err) throw err;
            res.send('Sucessfully added review.');
        });

    });
});

// TIP: check out the mongoose docs for more info on find functions

// finding and deleting the very last review for a movie
app.delete('/movie/:id/review/last', function(req, res) {
    // Exercise: Fill this endpoint in to delete the most recently added review for the specified movie

    Movie.findOne({ _id: req.params.id }, function(err, movie) {
        if (err) throw err;
        if (!movie) { return res.send('[delete last review] No movie found with that ID.')}

        movie.reviews.pop(); // remove last entry of reviews array

        movie.save(function(err) {
            if (err) throw err;
            res.send('Successfully removed last review of ' + movie.title);
        });
    });
});


app.listen(PORT, function() {
    console.log('App listening on port ' + PORT);
})
