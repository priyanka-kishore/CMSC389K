// CMSC 389K - Midterm Project
// Priyanka Kishore, 04/10/2020

var express = require('express'); // install Express module
var bodyParser = require('body-parser'); // Middleware = decodes and converts requests into readable format
var logger = require('morgan'); // Middleware = logs HTTP request details for debugging
var exphbs = require('express-handlebars'); // install Handlebars module for dynamic webpages
var dataUtil = require('./data-util');

var app = express();
var PORT = 6969;

var _DATA = dataUtil.loadData().all_reviews;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

// -----------------------------------------------------------------------------------------

// GET home endpoint
app.get('/',function(req,res){
  res.render('home', {
      data: _DATA
  });
})

// GET endpoint to start write a review
app.get('/writeReview', function(req, res) {
  res.render('writereview')
})

// POST endpoint to post new restaurant review
app.post('/writeReview', function(req, res) {
  var body = req.body; // input from the form!

  console.log(body);
  body.tags = body.tags.split(",");

  dataUtil.cleanData(body, _DATA);
  // save data to database (aka JSON file)
  _DATA.push(req.body);
  dataUtil.saveData(_DATA);
  res.redirect('/');
})

// GET API endpoint, returns all data points as JSON
app.get('/api/getReviews', function(req, res) {
  res.json(_DATA);
})

app.get('/restaurant/:name', function(req, res) {
  // compile all ratings for this rest. and give average stats

  var name = req.params.name;

  var ratings = dataUtil.getAvgRating(name, _DATA);
  var price = dataUtil.getAvgPrice(name, _DATA);
  var all = dataUtil.getReviewsFor(name, _DATA);

  res.render('restaurant', {
    all: all,
    name: name,
    ratings: ratings,
    price: price
  })
})

// GET nav filter on top 3 restaurants
app.get('/Top3', function(req, res) {
  var data = dataUtil.getTop3(_DATA); // returns array of 
  res.render('home', {
    data: data,
    filter: "Top Three Restaurants"
  })
})

// GET nav filter on low costs
app.get('/LowCost', function(req, res) {
  var data = dataUtil.getLowCost(_DATA); // returns array of 
  res.render('home', {
    data: data,
    filter: "Not Pricey Restaurants"
  }) 
})

// GET nav filter on med costs
app.get('/MedCost', function(req, res) {
  var data = dataUtil.getMedCost(_DATA); // returns array of 
  res.render('home', {
    data: data,
    filter: "Kinda Pricey Restaurants"
  }) 
})

// GET nav filter on high costs
app.get('/HighCost', function(req, res) {
  var data = dataUtil.getHighCost(_DATA); // returns array of 
  res.render('home', {
    data: data,
    filter: "Hella Pricey Restaurants"
  }) 
})

// GET nav filter: all restaurants in alphabetical order
app.get('/Alphabetical', function(req, res) {
  var data = dataUtil.getAlphabetized(_DATA); // returns array of 
  res.render('home', {
    data: data,
    filter: "All Restaurants Alphabetized",
    abc: "yes"
  }) 
})

app.listen(PORT, function() {
    console.log('Listening on port:', PORT);
});