// This is a subset of the states.
// Use this to actually run the game
// (assume this is the full set of states.
// This will make it easier to test.

var states = ["Idaho", "South Dakota", "Hawaii", "Alaska", "Alabama", "New York"];
// var states = ["Maryland"];

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


/*
 * The majority of this project is done in JavaScript.
 *
 * 1. Start the timer when the click button is hit. Also, you must worry about
 *    how it will decrement (hint: setInterval).
 * 2. Check the input text with the group of states that has not already been
 *    entered. Note that this should only work if the game is currently in
 * 3. Realize when the user has entered all of the states, and let him/her know
 *    that he/she has won (also must handle the lose scenario). The timer must
 *    be stopped as well.
 *
 * There may be other tasks that must be completed, and everyone's implementation
 * will be different. Make sure you Google! We urge you to post in Piazza if
 * you are stuck.
 */

var original_length = states.length;

// go through entire states list and make all lowercase
// for (var i = 0; i < states.length; i++) {
//     states[i].toLowerCase();
// }

 // start timer when button is pressed
$('#start_button').on("click", function() {
    var fiveMinutes = 60 * 5, twentySeconds = 20, test = 5
    var displayTag = $('#timer'); // grab tag to change

    $('#stateEntry').attr('disabled', false); // change disabled to true
    startTime(twentySeconds, displayTag);
});

 // TIMER
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

// makes input case insensitive
function includesCase(input) {
    for (var i = 0; i < states.length; i++) {
        var curr_state = states[i].toLowerCase();
        if (curr_state == input) {
            return states[i];
        }
    }
    return null;
}

// CHECK INPUT FROM BOX TO SEE IF MATCHES A STATE
function updateList(input) {
    // if state matches
    var lowerCase = input.toLowerCase();
    var theState = includesCase(lowerCase);

    if (theState != null && states.length > 0) {
        $('#list_div').append(`<p>${theState}</p>`); // move this to updateList()
        $('#stateEntry').val('');
        
        for (var i = 0; i < states.length; i++) { // removes found element from STATES array
            var curr_state = states[i].toLowerCase();
            if (curr_state == lowerCase) {
                states.splice(i, 1);
            }
        }
    }

    if (states.length <= 0) {
        displayWinner();
        clearInterval(interval);
    }
}

$('#stateEntry').on("keyup", function() { // get current input on every key press
    var input = $('#stateEntry').val();

    updateList(input); // TODO: make it non case sensitive!
});

 // IF TIMES UP: SHOW GAME OVER
function displayGameOver() {
    $('#timer').text("GAME OVER"); // replace timer with GAME OVER    
    $('#stateEntry').attr('disabled', true); // disable input field
    $('#timer').append(`<h2 style='color:green'>SCORE: ${original_length - states.length}/${original_length}</h2>`); // display score = correct / total

    // display which states the user did not get separately
    $('#list_div').append("<h2>Incorrect States:<h2>");
    for (var i = 0; i < states.length; i++) {
        $('#list_div').append(`<p>${states[i]}<p>`); 
    }
}

 // IF FINISHED BEFORE TIMES UP: SHOW WINNER
 function displayWinner() {
    $('#timer').text("YOU WIN!").attr("style", "color:green; font-size: 40px");
    $('#stateEntry').attr('disabled', true); // disable input field
 }