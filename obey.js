// SOUND SETUP
var sfxCorrect = document.createElement('audio');
var sfxWrong = document.createElement('audio');
var sfxVictory = document.createElement('audio');
var sfxObey = document.createElement('audio');
var sfxOp = [];
sfxOp[1] = document.createElement('audio');
sfxOp[2] = document.createElement('audio');
sfxOp[3] = document.createElement('audio');
sfxOp[4] = document.createElement('audio');
// SFX LOADING
sfxCorrect.setAttribute('src','./sfx/sfxCorrect.wav');
sfxWrong.setAttribute('src','./sfx/sfxWrong.wav');
sfxVictory.setAttribute('src','./sfx/sfxVictory.wav');
sfxObey.setAttribute('src','./sfx/sfxObey.wav');
sfxOp[1].setAttribute('src','./sfx/sfxOp1.wav');
sfxOp[2].setAttribute('src','./sfx/sfxOp2.wav');
sfxOp[3].setAttribute('src','./sfx/sfxOp3.wav');
sfxOp[4].setAttribute('src','./sfx/sfxOp4.wav');
sfxCorrect.setAttribute('preload','auto');
sfxWrong.setAttribute('preload','auto');
sfxVictory.setAttribute('preload','auto');
sfxObey.setAttribute('preload','auto');
sfxOp[1].setAttribute('preload','auto');
sfxOp[2].setAttribute('preload','auto');
sfxOp[3].setAttribute('preload','auto');
sfxOp[4].setAttribute('preload','auto');
// SFX VOLUME
sfxCorrect.volume = 0.15;
sfxWrong.volume = 0.15;
sfxVictory.volume = 0.15;
sfxObey.volume = 0.15;
sfxOp[1].volume = 0.15;
sfxOp[2].volume = 0.15;
sfxOp[3].volume = 0.15;
sfxOp[4].volume = 0.15;

var maxSequenceLength = 3; // the upper limit and what decides a win - set to 20
var beepSeq = []; // array holding sequence steps
var userSeq = []; // array holding the user sequence answer
var step = 0; // current step of array

var cpuRunning = 0;  // used to stop sequence from running, and to prevent
                     // user from adding entries to userSeq out of turn
var gameStarted = 0; // keeps track of when a new game is started

var roundWon = 0; // keep track if player wins or not
var userIsDone = 0; // lets the CPU know when the sequence's been filled

var strictMode = 0; // starts over if you fail even once

function playSound(sound){
  sound.currentTime = 0;
  sound.play();
}

function addToSeq(seq, num){
  seq.push(num);
}

function toggle(i){
  // bitwise xor toggle
  return i ^= 1;
}

function compareSeq(beepSeq, userSeq){
  // returns boolean value if the two sequences match
  let answer = beepSeq.every(function(v,i){
    return v === userSeq[i];
  });
  return answer;
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
  if(cpuRunning){
    if(!gameStarted){
      // start a new sequence when game is started for the first time
      addToSeq(beepSeq,getRandInt(0,3)+1);
      console.log("initial seq: "+beepSeq);
      gameStarted = 1;
    }
    if(step >= beepSeq.length){
      // checks if the sequence is ended
      animationRetrigger("op_obey", "obey_button_jQPush");
      playSound(sfxObey);
      step = 0; // reset step for next run
      cpuRunning = toggle(cpuRunning);  // toggles the game state
    } else{
      // sequence running
      animationRetrigger("op"+beepSeq[step], "op_button_jQPush");
      playSound(sfxOp[beepSeq[step]]);
      console.log("current step: "+(step)+" / sequence: "+beepSeq[step]);
      step++;
    }
  }

  if(userIsDone){
    // routine for handling user information, as well as victory conditions
    if(beepSeq.length >= maxSequenceLength && roundWon){
      // final round played and won, notify player of victory
      playSound(sfxVictory);
      console.log("YOU WIN!!!");
      // reinitialize all values for new game
      userIsDone = 0;
      beepSeq = [];
      userSeq = [];
      cpuRunning = 0;
      gameStarted = 0;
      return 0;
    }else if(beepSeq.length < maxSequenceLength && roundWon){
      // setup for next round if the final round hasn't been played
      addToSeq(beepSeq, getRandInt(0,3)+1);
      console.log("cpu seq: "+beepSeq);
    }else if(!roundWon && strictMode){
      // start all over if 'strictMode' is active
      beepSeq = [];
      addToSeq(beepSeq,getRandInt(0,3)+1);
    }
    // play the round, regardless of previous round outcome
    console.log("EMPTYING USER SEQUENCE");
    userSeq = []; // empty user sequence for next round
    setTimeout(function(){
      // adds a little delay so you don't miss the first step of next sequence
      console.log("TOGGLING GAME STATE");
      cpuRunning = toggle(cpuRunning);
      roundWon = 0;
    }, 200);
    userIsDone = toggle(userIsDone);
  }
}

mainGameLoop(); // fires the main gameloop once, then every nth delay as per setInterval
var gameLoopInterval = setInterval(mainGameLoop,750);  // run the game loop every 1.25 seconds

$(document).on('mousedown', '.op_button', function(){
  // checks what button the user clicked
  let userValue = parseInt($(this).attr('id')[2],10);
  playSound(sfxOp[userValue]);
  // detects the dynamically generated elements from animation retrigger
  if(gameStarted && !cpuRunning){
    // only register presses if the game's actually in progress AND it's the users turn
    addToSeq(userSeq, userValue);
    if(userSeq.length == beepSeq.length){
      console.log("user sequence: "+userSeq);
      console.log("cpu sequence: "+beepSeq);
      // check if the answer is the correct sequence
      setTimeout(function(){
        // tiny little timeout so the two sounds dont play on top of each other
        if(compareSeq(beepSeq, userSeq)){
          playSound(sfxCorrect);
          roundWon = 1;
          console.log("CORRECT SEQUENCE");
        }else{
          playSound(sfxWrong);
          roundWon = 0;
          console.log("WRONG SEQUENCE");
        }
        userIsDone = toggle(userIsDone);
      },150)
    }
  }
});

$(document).on('click', '.obey', function(){
  // starts the game
  for(var i=1;i<=4;i++){
    $('#op'+i).removeClass('no-show').addClass('op-popup');
  }
  $(this).empty().append("OBEY");
  setTimeout(function(){
    cpuRunning = toggle(cpuRunning);
    for(var i=1;i<=4;i++){
      $('#op'+i).removeClass('op-popup');
    }
  },1050);
})
