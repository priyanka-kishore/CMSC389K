var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    priority: { type: Number, required: true } // FOR LATER IMPLEMENTATION: used to order in list
});

var listSchema = new mongoose.Schema({
    name: { type: String, require: true },
    items: [itemSchema],
    isFavorite: { type: Boolean, required: true }
});

var categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    lists: [listSchema]
});

var Category = mongoose.model('Category', categorySchema);
var List = mongoose.model('List', listSchema);
var Item = mongoose.model('Item', itemSchema);

module.exports = {
    Category: Category,
    List: List,
    Item: Item
}