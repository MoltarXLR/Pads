const audioCtx = new AudioContext(); //allows access to webaudioapi
var sequencer = {}; // main sequencer
sequencer.sequence = []; //array for holding the sequence
var globalcontrol = "start";
function addToSequencer(padval) {
  sequencer.sequence.push(padval);
  console.log(sequencer.sequence);
}

// sequencer controller

const conDiv = document.querySelectorAll(".con-div");
conDiv.forEach((div) => {
  div.addEventListener("click", () => {
    const data = div.dataset.element;
    if (data === "erase") {
      sequencer.sequence = [];
      console.log("sequence erased");
    } else if (data === "stop") {
      console.log("sequence stop");
    } else if (data === "start") {
      console.log("sequence start.");
      recursion();
    }
    globalcontrol = data;
  });
});

  function recursion (){
    if (globalcontrol === "start")
    {
      console.log("in deep");
      playSeq();
      setTimeout(recursion, 1000);    
    }
    else {
      console.log("out of recursion")
    }
  }
  

//async functions for sequencer
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// sequencer player

async function playSeq() {
   console.log("in the sequencer");
  console.log(sequencer.sequence);
  for (let i = 0; i < sequencer.sequence.length; i++) {
    playFromSeq(sequencer.sequence[i]);
    console.log(sequencer.sequence[i].wave);
    await sleep(300);
  }
}

function playFromSeq(playObj) {
  // Create an oscillator with the specified frequency
  const oscillator = audioCtx.createOscillator();
  oscillator.type = playObj.wave;
  oscillator.frequency.value = playObj.freq;

  // Connect the oscillator to the output
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // Start the oscillator and schedule its stop after 1 second
  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1); // Smooth fade-out

  // Disconnect the oscillator after it completes
  oscillator.onended = () => {
    oscillator.disconnect();
  };
}

//pad set up
const padDiv = document.querySelectorAll(".pad-div"); // Replace '.clickable-div' with your desired class

padDiv.forEach((div) => {
  div.addEventListener("click", () => {
    const data = div.dataset.element;
    const playObj = {};
    playObj.freq = +data;
    playObj.wave = getSelectedData();
    playSineWave(+data);
    addToSequencer(playObj);
  });
});

// selecting your waveform
function getSelectedData() {
  const selectedButton = document.querySelector('input[name="choice"]:checked');
  const selectedData = selectedButton.dataset.value;
  console.log(selectedData);
  return selectedData;
  // Do something with the selectedData value
}

// audio context setup

function playSineWave(frequency) {
  // Create an oscillator with the specified frequency
  const oscillator = audioCtx.createOscillator();
  oscillator.type = getSelectedData();
  oscillator.frequency.value = frequency;

  // Connect the oscillator to the output
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // Start the oscillator and schedule its stop after 1 second
  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1); // Smooth fade-out

  // Disconnect the oscillator after it completes
  oscillator.onended = () => {
    oscillator.disconnect();
  };
}
