
# Welp - Restaurant Reviews

---

Name: Priyanka Kishore

Date: April 10, 2020

Project Topic: Restaurant Reviews

URL: 

---

### 1. Data Format and Storage

Data point fields:
- `Field 1`: Name          `Type: String`
- `Field 2`: Rating        `Type: Number`
- `Field 3`: Cost          `Type: Number`
- `Field 4`: Type          `Type: [String]`
- `Field 5`: Reviews       `Type: [String]`

Schema: 
```javascript
{
    name: String,
    rating: Number,
    cost: Number, // out of 3 (1: cheap, 2: moderate, 3: expensive) 
    type: [String],
    reviews: [String]
}
```

### 2. Add New Data

HTML form route: `/writeReview`
POST endpoint route: `/writeReview`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/writeReview',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
       name: 'Chipotle',
       rating: '5',
       price: '$',
       tags: ['burritos','nice chips','mexican'],
       new_review: 'amazing!!!'
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/api/getReviews`

### 4. Search Data

Search Field: not implemented :(

### 5. Navigation Pages

Navigation Filters
1. Top Three Rated -> `/Top3`
2. Not Pricey -> `/LowCost`
3. Kinda Pricey -> `/MedCost`
4. Hella Pricey -> `/HighCost`
5. Alphabetized Restaurants -> `/Alphabetical`

Additional Pages:
1. Each restaurant with all their reviews compiled -> `/restaurant/:name`

