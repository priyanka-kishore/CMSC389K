var fs = require('fs');

function loadData() {
    return JSON.parse(fs.readFileSync('data.json'));
}

function loadCleanData() {
    return JSON.parse(fs.readFileSync('clean_data.json'));

}
function saveData(data) {

    var obj = {
        all_reviews: data
    };

    fs.writeFileSync('data.json', JSON.stringify(obj));
}

function cleanData(body, data) {

    // getting everything from clean_data as objects
    single_data = JSON.parse(fs.readFileSync('clean_data.json')).all_reviews; // get existing

    console.log("cleaning...", body)
    var other_reviews = [];
    var found = false;

    // trying to find if this restaurants exists
    single_data.forEach(function(currObj) {
        if (currObj.name == body.name) { // if yes
            // do updates here
            found = true;
            currObj.reviews.push(body.new_review)
            other_reviews = currObj.reviews; // take existing reviews
          console.log("found match")
        }
    })

    if (found == false) { // add new one
        var obj = {
            name: body.name,
            rating: body.rating,
            price: body.price,
            tags: body.tags,
            reviews: [body.new_review]
        }
        single_data.push(obj)
    }


    fs.writeFileSync('clean_data.json', JSON.stringify({all_reviews: single_data})) // update new list
}

function getAllTags(data) {
    var allTags = [];
    for(var i = 0; i < data.length; i++) {
        var tags = data[i].tags;
        for(var j = 0; j < tags.length; j++) {
            if(!~allTags.indexOf(tags[j])) allTags.push(tags[j]);
        }
    }
    return allTags;
}

function getReviewsFor(restaurant, data) {
    compiled_reviews = [];
  
    data.forEach(function(currObj) {
      if (currObj.name == restaurant) {
        console.log("found one", restaurant)
        compiled_reviews.push(currObj.new_review)
      }
    })
  
    return compiled_reviews;
  }

function getTop3(data) {
    var single_data = loadCleanData().all_reviews;
    single_data.sort((a, b) => a.rating < b.rating ? 1 : -1)
    return [single_data[0], single_data[1], single_data[2]];
}

function getLowCost(data) {
    var single_data = loadCleanData().all_reviews;
    var res = [];
    
    single_data.forEach(function(curr) {
        if (curr.price == "$") {
            res.push(curr)
        }
    })

    return res;
}

function getMedCost(data) {
    var single_data = loadCleanData().all_reviews;
    var res = [];
    
    single_data.forEach(function(curr) {
        if (curr.price == "$$") {
            res.push(curr)
        }
    })

    return res;
}

function getHighCost(data) {
    var single_data = loadCleanData().all_reviews;
    var res = [];
    
    single_data.forEach(function(curr) {
        if (curr.price == "$$$") {
            res.push(curr)
        }
    })

    return res;
}

function getAlphabetized(data) {
    var single_data = loadCleanData().all_reviews;
    single_data.sort((a, b) => a.name > b.name ? 1 : -1)
    console.log(single_data)
    return single_data;
}

function getAvgRating(name, data) {
    return "★★★★★";
}

function getAvgPrice(name, data) {
    return "Not Pricey";
}


module.exports = {
    loadData: loadData,
    saveData: saveData,
    getAllTags: getAllTags,
    getReviewsFor: getReviewsFor,
    getTop3: getTop3,
    getLowCost: getLowCost,
    getMedCost: getMedCost,
    getHighCost: getHighCost,
    getAlphabetized: getAlphabetized,
    getAvgRating: getAvgRating,
    getAvgPrice: getAvgPrice,
    cleanData: cleanData
}
