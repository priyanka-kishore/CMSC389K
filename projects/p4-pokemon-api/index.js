// CMSC 389K - Project 4: Pokemon API
// Priyanka Kishore, 03/15/2020

var express = require('express'); // to use Express module
var bodyParser = require('body-parser');
var fs = require('fs'); // to use File System module
var pokeDataUtil = require("./poke-data-util");
var _ = require("underscore");

var app = express();
var PORT = 3000;

// reverse edits to poke.json every server restart
pokeDataUtil.restoreOriginalData();

// Load contents of poke.json into global variable.
var _DATA = pokeDataUtil.loadData().pokemon;
//console.log(_DATA);

/// Setup body-parser. No need to touch this.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Display an HTML homepage of all the pokemon in a table with two columns:
// (1) Pokemon ID (2) Link tag with Pokemon name that links to /pokemon/:pokemon_id
app.get("/", function(req, res) {
    var contents = "";
    _.each(_DATA, function(i) {
        contents += `<tr><td>${i.id}</td><td><a href="/pokemon/${i.id}">${i.name}</a></td></tr>\n`;
    })
    var html = `<html>\n<body>\n<table>${contents}</table>\n</body>\n</html>`;
    res.send(html);
});

// Display an HTML page with a table of all the Pokemon's data in two columns:
// (1) Key (2) Value (if the value is not a String, just show its toString representation)
// If the Pokemon ID does not exist, return an "Error: Pokemon not found".
app.get("/pokemon/:pokemon_id", function(req, res) {
    var _id = parseInt(req.params.pokemon_id), contents = "";
    var result = _.findWhere(_DATA, { id: _id })
    if (!result) { return res.send("Error: Pokemon not found") }

    for (var property in result) {
        contents += `<tr><td>${property}</td><td>${JSON.stringify(result[property])}</td></tr>\n`;
    }

    var html = `<html>\n<body>\n<table>${contents}</table>\n</body>\n</html>`;
    res.send(html);
});

// Display an HTML page with just an image of a given Pokemon ID:
// If the Pokemon ID does not exist, return an "Error: Pokemon not found".
app.get("/pokemon/image/:pokemon_id", function(req, res) {
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, { id: _id })
    if (!result) { return res.send("Error: Pokemon not found") }

    var html = `<html>\n<body>\n<img src="${result.img}">\n</body>\n</html>`;
    res.send(html);
});

/* Return the entire data entry associated with the given pokemon_id. */
app.get("/api/id/:pokemon_id", function(req, res) {
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, { id: _id })
    if (!result) return res.json({}); // Pokemon ID does not exist

    res.json(result);
});

/* Return an array of all the Pokemon in the given Pokemon's evolution chain in alphabetical. */
app.get("/api/evochain/:pokemon_name", function(req, res) {
    var _name = req.params.pokemon_name, result = _.findWhere(_DATA, { name: _name })
    if (!result) return res.json([]); // Pokemon name does not exist

    var prevs = result.prev_evolution, nexts = result.next_evolution, evo_list = [_name];

    if (prevs) { for (var i in prevs) evo_list.push(prevs[i].name); }
    if (nexts) { for (var i in nexts) evo_list.push(nexts[i].name); }
    res.json(evo_list.sort());
});

/* Return an array of all Pokemon of the given type in the order they appear */
app.get("/api/type/:type", function(req, res) {
    var _type = req.params.type, type_list = [];

    for (var i in _DATA) {
        if (_.contains(_DATA[i].type, _type, 0)) { type_list.push(_DATA[i].name); }
    }
    res.json(type_list);
});

/* Return an object with the name and weight of the heaviest Pokemon of a given type. */
app.get("/api/type/:type/heaviest", function(req, res) {
    var _type = req.params.type, max_weight = 0, max_pokemon;

    for (var i in _DATA) {
        var currPokemon = _DATA[i], currWeight = extract_weight(currPokemon.weight);
        if (_.contains(currPokemon.type, _type, 0) && currWeight > max_weight) {
            max_weight = currWeight;
            max_pokemon = currPokemon.name;
        }
    }
    if (max_weight == 0) return res.json({});
    res.json({ "name": max_pokemon, "weight": max_weight });
});

function extract_weight(weight_str) {
    return parseFloat(weight_str.match(/\d+.\d+/));
}

/* Adds the given weakness to the weaknesses array of a given pokemon. */
app.post("/api/weakness/:pokemon_name/add/:weakness_name", function(req, res) {
    var _name = req.params.pokemon_name, _weakness = req.params.weakness_name;
    var result = _.findWhere(_DATA, { name: _name })
    if (!result) { return res.send({}) }

    if (!_.contains(result.weaknesses, _weakness, 0)) {
        result.weaknesses.push(_weakness);
        pokeDataUtil.saveData(_DATA);
    }
    res.send({"name": _name, "weaknesses": result.weaknesses});
});

/* Removes the given weakness from the weaknesses array of a given pokemon. */
app.delete("/api/weakness/:pokemon_name/remove/:weakness_name", function(req, res) {
    var _name = req.params.pokemon_name, _weakness = req.params.weakness_name;
    var result = _.findWhere(_DATA, { name: _name })
    if (!result) { return res.send({}) }

    if (_.contains(result.weaknesses, _weakness, 0)) {
        var index = result.weaknesses.indexOf(_weakness);
        if (index !== -1) { result.weaknesses.splice(index, 1) }

        pokeDataUtil.saveData(_DATA);
    }
    res.send({"name": _name, "weaknesses": result.weaknesses});
});

// Start listening on port PORT
app.listen(PORT, function() {
    console.log('Server listening on port:', PORT);
});

// DO NOT REMOVE (for testing purposes)
exports.PORT = PORT
