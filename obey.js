var sfxCorrect = document.createElement('audio');
var sfxWrong = document.createElement('audio');
sfxCorrect.setAttribute('src','./sfx/user_correct.wav');
sfxCorrect.setAttribute('preload','auto');
sfxCorrect.volume = 0.15;
sfxWrong.setAttribute('src','./sfx/user_wrong.wav');
sfxWrong.setAttribute('preload','auto');
sfxWrong.volume = 0.15;

var maxSequenceLength = 4; // the upper limit and what decides a win - set to 20
var beepSeq = []; // array holding sequence steps
var userSeq = []; // array holding the user sequence answer
var step = 0; // current step of array

var gameRunning = 0;
var gameStarted = 0;

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
  if(gameRunning){
    if(!gameStarted){
      // start a new sequence when game is started for the first time
      addToSeq(beepSeq,getRandInt(0,3)+1);
      console.log("initial seq: "+beepSeq);
      gameStarted = 1;
    }
    if(step >= beepSeq.length){
      // checks if the sequence is ended
      if(beepSeq.length < maxSequenceLength){
        // adds a new beep sequence if the current sequence is finished
        animationRetrigger("op_obey", "obey_button_jQActive");
      }
      step = 0; // reset step for next run
      // clearInterval(gameLoopInterval);
      gameRunning = toggle(gameRunning);
    } else{
      // sequence running
      animationRetrigger("op"+beepSeq[step], "op_button_jQActive");
      console.log("current step: "+(step)+" / sequence: "+beepSeq[step]);
      step++;
    }
  }
}

mainGameLoop(); // fires the main gameloop once, then every nth delay as per setInterval
var gameLoopInterval = setInterval(mainGameLoop,850);  // run the game loop every 1.25 seconds

$(document).on('mousedown', '.op_button', function(){
  // supports dynamically added objects (such as the replaced buttons for anim retrigger)
  if(gameStarted){
    // only register presses if the game's actually in progress
    let userValue = parseInt($(this).attr('id')[2],10);
    addToSeq(userSeq, userValue);
    console.log("user sequence: "+userSeq);
    if(userSeq.length == beepSeq.length){
      // check if the answer is the correct sequence
      if(compareSeq(beepSeq, userSeq)){
        playSound(sfxCorrect);
        console.log("CORRECT SEQUENCE");
      }else{
        playSound(sfxWrong);
        console.log("WRONG SEQUENCE");
      }
      if(beepSeq.length < maxSequenceLength){
        // setup for next round if the final round hasn't been played
        console.log("EMPTYING USER SEQUENCE");
        userSeq = []; // empty user sequence for next round
        addToSeq(beepSeq, getRandInt(0,3)+1);
        console.log("cpu seq: "+beepSeq);
        setTimeout(function(){
          // makes sure 850 ms passes before game starts again
          console.log("TOGGLING GAME STATE");
          gameRunning = toggle(gameRunning);
        }, 850)
      }else if(beepSeq.length >= maxSequenceLength){
        // final round played, notify player of victory
        // play YOU WIN sound
        console.log("YOU WIN!!!");
        // reinitialize all values
        step = 0;
        beepSeq = [];
        userSeq = [];
        gameRunning = 0;
        gameStarted = 0;
      }
      // gameRunning = toggle(gameRunning);
    }
  }
});

$(document).on('click', '.obey', function(){
  // not sure if this should even be used. maybe to start the game?
  gameRunning = toggle(gameRunning);
})
