
# CollabList (Incomplete)

---

Name: Priyanka Kishore

Date: May 12, 2020

Project Topic: Collaborative To-Do Lists

URL: [submitted on the Submit Server]

---

### 1. Fulfillment of Midterm Project Specifications

Uses MongoDB to store data of three difference schemas, as followed:

Schema: 
```javascript
itemSchema = {
    name: String,
    priority: Number
}

listSchema = {
    name: String,
    items: [itemSchema],
    isFavorite: Boolean
}

categorySchema = {
    name: String,
    lists: [listSchema]
}
```

The idea is that there are *categories* of various lists, and each list contains items.

For example, a category is "School", with lists = ["CMSC389K", "ENGL393"]. List "CMSC389K" has items = ["finish final project", "decide p/f by Tuesday"] and list "ENGL393" has items = ["final paper due mon"].

### 2. Live Updates

WHAT WORKS:
Live updates work from the `/items` endpoint, where new categories can be created.

Example server side socket usage:
```javascript
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
```

### 3. View Data

1. GET endpoint route: `/`
2. GET endpoint route: `/create`
3. GET endpoint route: `/items`

Handlebars pages implemented:
1. `dash.handlebars`
2. `create.handlebars`
3. `myLists.handlebars`
4. `main.handlebars`

Intended handlebars pages (not implemented):
1. `email.handlebars`
2. `about.handlebars`
3. `list.handlebars`

*Example:*-------------------------------
HTML form route: `/create`

POST endpoint route: `/add/category`

Example POST request to endpoint: 
```javascript
app.post('/add/category', function(req, res) {
    var newCategory = new models.Category({
        name: req.body.name,
        lists: []
    });
    
    newCategory.save(function(err) {
        if (err) throw err;
        res.send('Successfully created new category!')
    });
});
```
------------------------------------------

### 4. API

(These all work from Postman, not from UI)

1. GET endpoint `/api`
2. POST endpoint `/add/category`
3. POST endpoint `/add/list`
4. POST endpoint `/add/item`
5. DELETE endpoint `/remove/list`
6. DELETE endpoint `/remove/item`
7. DELETE endpoint `/remove/category`


Example API implementation:
```javascript
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
```
### 5. Modules

Modules exported are the schemas previously mentioned.

```javascript
var Category = mongoose.model('Category', categorySchema);
var List = mongoose.model('List', listSchema);
var Item = mongoose.model('Item', itemSchema);

module.exports = {
    Category: Category,
    List: List,
    Item: Item
}
```

### 6. NPM Packages

Other NPM packages outside of the ones we learned:
1. Dark Mode -> https://www.npmjs.com/package/darkmode-js

Intended NPM packages (not implemented):
1. https://nodemailer.com/about/, https://www.w3schools.com/nodejs/nodejs_email.asp (would have been used to email lists to provided email address)

### 7. User Interface

None.