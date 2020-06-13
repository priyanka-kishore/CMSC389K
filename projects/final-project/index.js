// ====================================== SET UP ======================================

// -----setup modules-----

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var Handlebars = require('handlebars')
var mongoose = require('mongoose'); // formats data for MongoDB
var dotenv = require('dotenv'); // allows us to interface with .env file
var {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

var models = require('./models/Schemas.js');
var _ = require('underscore');
var PORT = 1234

// -----set up web socket-----
var http = require('http').Server(app);
var io = require('socket.io')(http);

// -----set up Express-----
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static('public'));
// app.engine('handlebars', exphbs({ defaultLayout: 'main' })); // always loads main
app.engine('handlebars', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');

// -----set up Mongoose-----
dotenv.config(); // loads .env file
console.log(process.env.MONGODB);
mongoose.Promise=global.Promise;
mongoose.connect(process.env.MONGODB); // mongoose connecting to specific MongoDB server we set up
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});


// =================== API endpoints (3 GET, 3 POST, 3 DELETE) ===================

// (0) GET - page for adding items to lists
app.get('/create', function(req, res) {
    console.log('CREATE endpoint');
    res.render('create');
});

// (1) GET - dashboard homepage (favorited lists)
app.get('/', function(req, res) {
    console.log('HOME endpoint');

    res.render('dash') // loads 'dash' in {{{body}}} of 'main'
});

// (2) GET - all items
app.get('/items', function(req, res) {
    console.log('GET ALL ITEMS endpoint');

    // gather all categories
    models.Category.find({}, function(err, categories) {
        if (err) throw err;
        var allItems = [];

        _.each(categories, function(category) { 
            _.each(category.lists, function(l) {
                _.each(l.items, function(it) {
                    allItems.push(it); // worry about duplicates later?
                });
            });
        });
        // console.log(allItems);
        res.render('myLists', {allItems: allItems}); // sends list of items to {{{myLists}}}
    });
});

// (2.5) GET - all categories API
app.get('/api', function(req,res) {
    console.log('GET ALL ITEMS API');
    models.Category.find({}, function(err, categories) {
        if (err) throw err;
        console.log(categories);
        res.send(categories);
    });
});

// (3) GET - all items of given list from given category
app.get('/items/:category/:list', function(req, res) {
    console.log('GET ALL ITEMS OF LIST IN CATEGORY endpoint');

    // find category
    models.Category.findOne({ name: req.params.category }, function(err, category) {
        if (err) throw err;
        if (!category) return res.send('No category found with that name!');

        // find list in category
        var list = _.findWhere(category.lists, {name: req.params.list});
        if (!list) return res.send('No list found with that name in this category!');

        console.log(list);
        res.send(list);        
    });
});

// (4) POST - new category
app.post('/add/category', function(req, res) {
    console.log('ADD NEW CATEGORY endpoint');

    console.log("> " + req.body.name);
    // create new category from fields in {{}} page
    var newCategory = new models.Category({
        name: req.body.name,
        lists: []
    });

    console.log("> " + req.body.name);
    
    // save to database
    newCategory.save(function(err) {
        if (err) throw err;
        res.send('Successfully created new category!')
    });

    // res.redirect('/'); // redirect to dashboard after adding
});

// (5) POST - new list in given category
app.post('/add/list', function(req, res) {
    console.log('ADD NEW LIST IN CATEGORY endpoint');

    // find category
    models.Category.findOne({ name: req.body.categoryName }, function(err, category) {
        if (err) throw err;
        if (!category) return res.send('No category found with that name!');

        // create new list from fields in {{}} page
        var newList = new models.List({
            name: req.body.listName,
            items: [],
            isFavorite: req.body.favorite
        });

        // push to category
        category.lists.push(newList);

        // save to database
        category.save(function(err) {
            if (err) throw err;
            res.send('Successfully created new list in ' + category.name + '!');
        });
    });

    res.redirect('/'); // go to dashboard after adding
});

// (6) POST - new item in given list of given category
app.post('/add/item', function(req, res) {
    console.log('ADD NEW ITEM IN LIST IN CATEGORY endpoint');

    // find category
    models.Category.findOne({ name: req.body.categoryName }, function(err, category) {
        if (err) throw err;
        if (!category) return res.send('No category found with that name!');

        // find list in category 
        var list = _.findWhere(category.lists, {name: req.body.listName});
        if (!list) return res.send('No list found with that name in this category!');

        // push new item onto list
        list.items.push(new models.Item({
            name: req.body.itemName,
            priority: req.body.priority
        }));

        // replace old list with updated list
        category.lists = _.without(category.lists, list);
        category.lists.push(list);

        // save to category
        category.save(function(err) {
            if (err) throw err;
            return res.send('Successfully added new item in ' + req.body.listName + '!');
        });
    });
});

// (7) DELETE - category
app.delete('/remove/category', function(req, res) {
    console.log('DELETE CATEGORY endpoint');

    models.Category.findOneAndRemove(req.body.categoryName, function(err, category) {
        if (err) throw err;
        if (!category) return res.send('No category with that name!');

        res.send('Successfully deleted category ' + category.name + '!');
    });
});

// (8) DELETE - list from given category
app.delete('/remove/list', function(req, res) {
    console.log('DELETE LIST FROM CATEGORY endpoint');

    // find category
    models.Category.findOne( {name: req.body.categoryName}, function(err, category) {
        if (err) throw err;
        if (!category) return res.send('No category with that name!');

        // find list
        var listToDelete = _.findWhere(category.lists, {name: req.body.listName});
        if (!listToDelete) return res.send('No list found with that name in this category!');

        // remove list
        category.lists = _.without(category.lists, listToDelete);

        // save deletion
        category.save(function(err) {
            if (err) throw err;
            res.send('Successfully deleted list ' + listToDelete.name + '!');
        });
    });
});

// (9) DELETE - item from given list of given category
app.delete('/remove/item', function(req, res) {
    console.log('DELETE ITEM FROM LIST IN CATEGORY endpoint');

    // find category
    models.Category.findOne( {name: req.body.categoryName}, function(err, category) {
        if (err) throw err;
        if (!category) return res.send('No category with that name!');

        // find list
        var listCopy = _.findWhere(category.lists, {name: req.body.listName});
        if (!listCopy) return res.send('No list found with that name in this category!');

        // find item in list
        var itemToDelete = _.findWhere(listCopy.items, {name: req.body.itemName});
        if (!itemToDelete) return res.send('No item found with that name in this list!');

        // remove item from listCopy's [items]
        listCopy.items = _.without(listCopy.items, itemToDelete); 

        // replace old list with updated list
        category.lists = _.without(category.lists, listCopy);
        category.lists.push(listCopy);

        // save deletion
        category.save(function(err) {
            if (err) throw err;
            res.send('Successfully deleted item ' + itemToDelete.name + '!');
        });
    });
});


// server side socket stuff
io.on('connection', function(socket) {
    console.log('NEW connection!');

    // listen for new information from clients
    socket.on('new component', function(value) {
        console.log('listened and received new information')
        io.emit('new component', value); // update everyone's lists
    })

    // clients disconnecting from server
    socket.on('disconnect', function() {
        console.log('User has disconnected');
    });
});



// Verify server is listening at PORT
http.listen(PORT, function() {
    console.log('======COLLAB-LIST LISTENING ON PORT: ' + PORT);
});