// the following two lines allow us to install/use the Mongoose node packacge
var mongoose = require('mongoose'); 
mongoose.Promise = global.Promise

// In Java, this class would have looked something like the following:

// public Movie {
//     private String title;
//     private int year;
//     private String genre;
//     private Review[] reviews;
    
//     ...
// }


// First we must define a schema (describes the "object")

// the following uses mongoose's schema constructor to define what attributes make up a review
var reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 0.0,
        max: 5.0,
        required: true // causes this attribute to be required for a schema
    },
    comment: {
        type: String
    },
    author: {
        type: String,
        required: true
    }
}); 


// Let's define a second schema 

var movieSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    year:{
        type: Number,
        required: true 
    },
    genre:{
        type: String,
        required: true 
    },
    reviews:[reviewSchema] // an array of the reviewSchema
});

// allows for use of these schemas outside this file (specifically index.js)
var Movie = mongoose.model('Movie', movieSchema);
// var Review = mongoose.model('Review', reviewSchema); // i added this
module.exports = Movie;
// module.exports = { // i added this, i think it works like this
//     Movie: Movie,
//     Review: Review
// }