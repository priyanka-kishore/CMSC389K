// This is a subset of the states.
// Use this to actually run the game
// (assume this is the full set of states.
// This will make it easier to test.

var states = ["Idaho", "South Dakota", "Hawaii", "Alaska", "Alabama", "New York"];
// var states = [
//     "Alabama", "Alaska", "Arizona", "Arkansas", "California",
//     "Colorado", "Connecticut", "Delaware", "District Of Columbia", "Florida",
//     "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana",
//     "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
//     "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
//     "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
//     "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
//     "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
//     "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah",
//     "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin",
//     "Wyoming"
// ]

// These are all the states. It maps the state name to the number which you'll
// want to use in your API call.
var abvMap = {
    "Alabama": "01",
    "Alaska": "02",
    "Arizona": "04",
    "Arkansas": "05",
    "California": "06",
    "Colorado": "08",
    "Connecticut": "09",
    "Delaware": "10",
    "District Of Columbia": "11",
    "Florida": "12",
    "Georgia": "13",
    "Hawaii": "15",
    "Idaho": "16",
    "Illinois": "17",
    "Indiana": "18",
    "Iowa": "19",
    "Kansas": "20",
    "Kentucky": "21",
    "Louisiana": "22",
    "Maine": "23",
    "Maryland": "24",
    "Massachusetts": "25",
    "Michigan": "26",
    "Minnesota": "27",
    "Mississippi": "28",
    "Missouri": "29",
    "Montana": "30",
    "Nebraska": "31",
    "Nevada": "32",
    "New Hampshire": "33",
    "New Jersey": "34",
    "New Mexico": "35",
    "New York": "36",
    "North Carolina": "37",
    "North Dakota": "38",
    "Ohio": "39",
    "Oklahoma": "40",
    "Oregon": "41",
    "Pennsylvania": "42",
    "Rhode Island": "44",
    "South Carolina": "45",
    "South Dakota": "46",
    "Tennessee": "47",
    "Texas": "48",
    "Utah": "49",
    "Vermont": "50",
    "Virginia": "51",
    "Washington": "53",
    "West Virginia": "54",
    "Wisconsin": "55",
    "Wyoming": "56",
}

var original_length = states.length;

 /* START TIME WHEN BUTTON PRESSED */
$('#start_button').on("click", function() {
    var fiveMinutes = 60 * 5, twentySeconds = 20;
    var displayTag = $('#timer'); // grab tag to change

    $('#stateEntry').attr('disabled', false); // change disabled to true
    startTime(twentySeconds, displayTag);
});


/* GET CURRENT INPUT ON EVERY KEYUP EVENT */
$('#stateEntry').on("keyup", function() { 
    var input = $('#stateEntry').val();
    updateList(input);
});


/* HOVER OVER STATE AND GET NUMBER OF SPANISH-SPEAKERS */
$(document).on("mouseover", ".stateList", function() {
    var stateNum = abvMap[$(this).html()]; // get num of state that is being hovered over

    // call api for value
    $.get(`https://api.census.gov/data/2013/language?get=EST,LANLABEL,NAME&for=state:${stateNum}&LAN=625`, function(data) {
        var value = data[1][0]; // number of spanish speakers in JSON object
        
        // append value
        $('#spanish').empty();
        $('#spanish').append(`No. of Spanish-speakers: ${numberWithCommas(value)}`)
    });
})

// $(document).on("mouseleave", ".stateList", function() {
//         $('#spanish').empty();
//         $('#spanish').append(`No. of Spanish-speakers: ${numberWithCommas(value)}`)
// })


/* RETURNS NUMBER STRING WITH COMMA SEPARATORS */
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


 /* TIMER */
var interval;
function startTime(duration, display) {
    var timer = duration, minutes, seconds;

    interval = setInterval(function() {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.text(minutes + ":" + seconds); // update HTML with new time

        if (--timer < 0) {
            displayGameOver();
            clearInterval(interval); // stops updating timer
        }
    }, 1000); // refresh every 1000ms = 1s
}


/* makes input case insensitive and returns state if correct */
function includesCase(input) {
    for (var i = 0; i < states.length; i++) {
        var curr_state = states[i].toLowerCase();
        if (curr_state == input) {
            return states[i];
        }
    }
    return null;
}

/* CHECK INPUT AND ADD TO LIST IF CORRECT*/
function updateList(input) {
    // if state matches
    var lowerCase = input.toLowerCase();
    var theState = includesCase(lowerCase);

    if (theState != null && states.length > 0) { // if state exists and got it correct
        $('#list_div').append(`<p class="stateList">${theState}</p>`); // add to correct states list
        

        $('#stateEntry').val(''); // empty input
        
        for (var i = 0; i < states.length; i++) { 
            var curr_state = states[i].toLowerCase();
            if (curr_state == lowerCase) {
                states.splice(i, 1); // removes found element from STATES array
            }
        }
    }

    if (states.length <= 0) { // got all states before timer ends
        displayWinner();
        clearInterval(interval); // stop timer
    }
}


 /* IF TIMES UP: SHOW GAME OVER + STATS */
function displayGameOver() {
    $('#timer').text("GAME OVER"); // replace timer with GAME OVER    
    $('#stateEntry').attr('disabled', true); // disable input field
    $('#timer').append(`<h2 style='color:green'>SCORE: ${original_length - states.length}/${original_length}</h2>`); // display score = correct / total

    // display which states the user did not get separately
    $('#list_div').append("<h2>Incorrect States:<h2>");
    for (var i = 0; i < states.length; i++) {
        $('#list_div').append(`<p class="stateList">${states[i]}<p>`); 
    }
}

 /* IF FINISHED BEFORE TIMES UP: SHOW WINNER */
 function displayWinner() {
    $('#timer').text("YOU WIN!").attr("style", "color:green; font-size: 40px");
    $('#stateEntry').attr('disabled', true); // disable input field
 }