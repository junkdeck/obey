$(document).ready(function(){
  var op1 = $('#op1');
  var op2 = $('#op2');
  var op3 = $('#op3');
  var op4 = $('#op4');
});

var maxSequenceLength = 20; // the upper limit and what decides a win - set to 20
var beepSeq = []; // array holding sequence steps
var answerSeq = [];
var step = 0; // current step of array

var buttonElements; // placeholder for HTMLCollections so clicking buttans work
var buttonArray;  // placeholder for Array for buttons, so foreach works

var gameRunning = 0;

function addToSeq(seq, num){
  seq.push(num);
}

function toggle(i){
  // bitwise xor toggle
  return i ^= 1;
}

function getRandInt(min,max){
  var i = Math.floor(Math.random()*((max)-min)+min);
  return i;
}

function animationRetrigger(elm_selector, anim){
  // setup for animation retrigger
  var elm = document.getElementById(elm_selector);  // "op"+beepSeq[step]
  var newElm = elm.cloneNode(true);
  elm.parentNode.replaceChild(newElm,elm);
  // triggers animation on corresponding entry in sequence
  $("#"+elm_selector).addClass(anim);  // "op_button_jQActive"
}

function mainGameLoop(){
  // main game loop
  if(gameRunning){
    if(step >= beepSeq.length){
      // checks if the sequence is ended
      if(beepSeq.length < maxSequenceLength){
        // adds a new beep sequence if the current sequence is finished
        animationRetrigger("op_obey", "obey_button_jQActive");
        addToSeq(beepSeq,getRandInt(0,3)+1);
        console.log(beepSeq);
      }
      step = 0; // reset step for next run
      // clearInterval(gameLoopInterval);
      gameRunning = toggle(gameRunning);
    } else{
      // sequence running
      console.log("current step: "+(step));
      animationRetrigger("op"+beepSeq[step], "op_button_jQActive");
      step++;
    }
  }
}

mainGameLoop(); // fires the main gameloop once, then every nth delay as per setInterval
var gameLoopInterval = setInterval(mainGameLoop,1250);  // run the game loop every 1.25 seconds

$(document).on('click', '.op_button', function(){
  // supports dynamically added objects (such as the replaced buttons for anim retrigger)
  console.log($(this).attr('id'));
});

$(document).on('click', '.obey', function(){
  // not sure if this should even be used. maybe to start the game?
  gameRunning = toggle(gameRunning);
})
