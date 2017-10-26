$(document).ready(function(){
  var op1 = $('#op1');
  var op2 = $('#op2');
  var op3 = $('#op3');
  var op4 = $('#op4');
});

var maxSequenceLength = 4; // the upper limit and what decides a win - set to 20
var beepSeq = []; // array holding sequence steps
var step = 0; // current step of array

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

function mainGameLoop(){
  // main game loop
  if(step >= beepSeq.length){
    // adds a new beep sequence if the current sequence is finished
    if(beepSeq.length < maxSequenceLength){
      // adds a new entry to the beep pattern sequence
      addToSeq(beepSeq,getRandInt(0,3)+1);
      console.log(beepSeq);
    }
    step = 0; // reset step for next run
    lastStep = null;
  }
  lastStep = step;
  console.log("current step: "+(step));

  // setup for animation retrigger
  var elm = document.getElementById("op"+beepSeq[step]);
  var newElm = elm.cloneNode(true);
  elm.parentNode.replaceChild(newElm,elm);
  // triggers animation on corresponding entry in sequence
  $("#op"+beepSeq[step]).addClass("op_button_jQActive");
  step++;
}

var gameLoopInterval = setInterval(mainGameLoop,1250);  // run the game loop every 1.25 seconds

$('.op_button').on("click", function(){
  console.log($(this));
});
