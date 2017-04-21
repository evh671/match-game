// Counts the number of cards pair matches
var numOfMatches=0;

// record start time
var startTime;

// Init MatchGame Object
var MatchGame = {};

function gameInit() {
    // Init num of two cards matches
    numOfMatches = 0;

    // Init Timer
    startTime = new Date();

    // Generates a random 4x4 array of numbers ( 1 - 8 )
    var $cardValues = MatchGame.generateCardValues();

    // Reference to the game html div
    var $game = $('#game .row');

    // Render the cards on the View and listens to user's click
    MatchGame.renderCards($cardValues, $game);

    setTimeout(MatchGame.timerCountUp, 1000);

}

/*
 Sets up a new game after HTML document has loaded.
 Renders a 4x4 board of cards.
 */
$(document).ready(function() {
    gameInit();
});


/*
  Generates and returns an array of matching card values.
 */

MatchGame.generateCardValues = function () {

    var numsArray=[];
    for (var i=1;i<=8;i++) {
        numsArray.push(i);
        numsArray.push(i);
    }

    var generatedValuesArray = [];

    while (numsArray.length!=0)
    {
        // Generating a value to the new array randomly
        var randomIndex = getRandomInt(0, numsArray.length-1);
        generatedValuesArray.push(numsArray[randomIndex]);
        numsArray.splice(randomIndex,1);
    }

    console.log(generatedValuesArray);
    return generatedValuesArray;

};

/*
  Converts card values to jQuery card objects and adds them to the supplied game
  object.
*/

MatchGame.renderCards = function(cardValues, $game) {
    var colorsArray=['hsl(25,85%,65%)','hsl(55,85%,65%)','hsl(90,85%,65%)','hsl(160,85%,65%)','hsl(220,85%,65%)',
                     'hsl(265,85%,65%)','hsl(310,85%,65%)','hsl(360,85%,65%)'];


    // Game Initialization
    $game.empty(); // Empty the Game Object


    $game.data("flippedCards",[]);

    // Rendering the Cards
    for (var i=0; i<cardValues.length; i++) {

        var $newCard = $('<div class="col-xs-3 card"></div>');

        // var $newCard = $('<div class="col-xs-3 card"><div class="front"></div><div class="back"></div></div>');

        // $newCard.data("cardData",{ value:cardValues[i], flipped:false, color:colorsArray[cardValues[i]-1]});

        $newCard.data("value",cardValues[i]).data("color",colorsArray[cardValues[i]-1]).data("flipped",false);

        $game.append($newCard);

    }

    $('.card').click(function(){
        $selectedCard = $(this);
        MatchGame.flipCard($selectedCard,$game);
    });

};

/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
 */

MatchGame.flipCard = function($card, $game) {

    // If the selected card is already flipped than do nothing!
    if ($card.data("flipped"))
        return;

    // mark that the selected card is flipped
    $card.data("flipped",true);




    // Put the selected card color when it's flipped
    $cardColor = $card.data("color");
    $card.css("background-color",$cardColor).css("color","rgb(255,255,255)");


    $value = $card.data("value");
    $card.html("<span class='front-card'>"+$value+"</span>");

    $flippedCards =$game.data("flippedCards");

    $flippedCards.push($card);
    $game.data("flippedCards",$flippedCards);
    if ($flippedCards.length == 2) {

        var $flippedCard1 = $flippedCards[0];
        var $flippedCard2 = $flippedCards[1];

        var $flippedCard1Value = $flippedCards[0].data("value");
        var $flippedCard2Value = $flippedCards[1].data("value");

        if ($flippedCard1Value===$flippedCard2Value) {
            $flippedCard1.css("background-color","rgb(153,153,153)").css("color","rgb(204,204,204)");
            $flippedCard2.css("background-color","rgb(153,153,153)").css("color","rgb(204,204,204)");
            numOfMatches++;

            if (numOfMatches==8) {
                // You win! Modal

                $(function(){
                    //----- OPEN
                    $('[data-popup="popup-1"]').fadeIn(350);

                    //----- CLOSE
                    $('[data-popup-close]').on('click', function(e)  {
                        $('[data-popup="popup-1"]').fadeOut(350);

                        e.preventDefault();

                        // Reset Timer Display
                        $(".time").text("00:00");

                        // Restart the game!!!
                        gameInit();

                    });

                });
            }
        }
        else {
            // Change the two cards back to unflipped mode

            setTimeout(function() {
                $flippedCard1.css("background-color","rgb(32,64,86)").css("color","rgb(32,64,86)");
                $flippedCard2.css("background-color","rgb(32,64,86)").css("color","rgb(32,64,86)");
                $flippedCard1.html("");
                $flippedCard2.html("");
                $flippedCard1.data("flipped",false);
                $flippedCard2.data("flipped",false);
            }, 400);

        }

        // After 2 cards were flipped, clean the flipped array
        $game.data("flippedCards",[]);

    }

};



/*
 Generates and returns an array of matching card values.
 */
MatchGame.timerCountUp = function () {

    if (numOfMatches != 8 )
    {
        // later record end time
        var endTime = new Date();

        // time difference in ms
        var timeDiff = endTime - startTime;

        // strip the miliseconds
        timeDiff /= 1000;

        // get seconds
        var seconds = Math.round(timeDiff % 60);

        // remove seconds from the date
        timeDiff = Math.floor(timeDiff / 60);

        // get minutes
        var minutes = Math.round(timeDiff % 60);

        // remove minutes from the date
        timeDiff = Math.floor(timeDiff / 60);

        // get hours
        var hours = Math.round(timeDiff % 24);

        // remove hours from the date
        timeDiff = Math.floor(timeDiff / 24);

        // the rest of timeDiff is number of days
        var days = timeDiff;

        // reset seconds once getting to 60 seconds!
        if (seconds>59)
            seconds=0;

        // Display timer on screen
        if (seconds>= 0 && seconds <10)
            $(".time").text("0"+ minutes + ":0" + seconds);

        else if (minutes>= 0 && minutes <10)
            $(".time").text("0"+ minutes + ":" + seconds);

        else
            $(".time").text(minutes + ":" + seconds);

        setTimeout(MatchGame.timerCountUp, 1000);

    }

};


