/*
This uses a ml5 charRNN model trained on a corpus of my essay
For more about ml5 see https://ml5js.org/
Based on example by ellennickles on GitHub. Thanks Ellen!
*/

let charRNN;
let textInput;
let tempSlider;

let modelIsReady = false
let runningInference = false;
let autoGenerating = false;

let currentText = '';

function setup() {
  noCanvas();

  // Create the charRNN generator passing it the model directory
  charRNN = ml5.charRNN('./models/essayten/', modelReady);

  // Grab the DOM elements
  textInput = select('#textInput');
  tempSlider = select('#tempSlider');

  // DOM element events
  select('#reset').mousePressed(onResetButton);
  select('#generate').mousePressed(onGenerateButton);
  select('#stop').mousePressed(onStopButton);


  tempSlider.input(updateSliders);
}

// Update the slider values
function updateSliders() {
  select('#temperature').html(tempSlider.value());
}

function modelReady() {
  select('#status').html('is born. ' + new Date().toLocaleString());
  modelIsReady = true;
}

// Read and seed with full text from input box
function generateWithFullInputText() {
  currentText = textInput.value();
  generate(currentText, false);
}

// Seed with last character of current text, preserving state (stateful LSTM)
function generateWithSingleChar() {
  generate(currentText.slice(-1), true);
}

// Update UI with current text
function updateTextUI() {
  select('#result').html(currentText);
  // if (currentText.length < 1000){
  //   select('#result').html(currentText);
  // }
  // else if (currentText.length < 2000){
  //   select('#result2').html('It is my position that graphic communication design' + currentText.substring(1000));
  //   }
  // else if (currentText.length < 3000) {
  //   select('#result3').html('The ultimate aim of this critical shift in GCD practice is to' + currentText.substring(2000));
  // }
  // else if (currentText.length < 4000) {
  //   select('#result4').html('This essay will explore in detail the above argument through the' + currentText.substring(3000));
  // }
  // else if (currentText.length < 5000) {
  //   select('#result5').html('Hyperreality, put forward by Jean Baudrillard, is the state where representations or' + currentText.substring(4000));
  // }
  // else if (currentText.length < 6000) {
  //   select('#result6').html('Within hyperreality, reality is indistinguishable from' + currentText.substring(5000));
  // }
  // else if (currentText.length < 7000) {
  //   select('#result7').html('If simulacra are representations that signify something real, then' + currentText.substring(6000));
  // }
  // else if (currentText.length < 8000) {
  //   select('#result8').html('The phenomenon of reality television is a' + currentText.substring(7000));
  // }
  // else if (currentText.length < 9000) {
  //   select('#result9').html('It should be noted that I tend to think of hyperreality in' + currentText.substring(8000));
  // }
}

// Clear current text, stop auto-generating
function onResetButton() {
  currentText = '';
  updateTextUI();
  autoGenerating = false;
}

// Start auto-generating
function onGenerateButton() {
  if(currentText == '') generateWithFullInputText();
  else generateWithSingleChar();
  autoGenerating = true;
}

// Stop auto-generating
function onStopButton() {
  autoGenerating = false;
}

// Generate new text
function generate(seed, stateful) {
   // prevent starting inference if we've already started another instance
  if(!runningInference) {
    runningInference = true;

    // Update the status log
    select('#status').html('is writing...');

    let data = {
      seed: seed,
      temperature: tempSlider.value(),
      length: 2,
      stateful: stateful,
    };

    // Generate text
    charRNN.generate(data, gotData);

    // When it's finished
    function gotData(err, result) {
      if(result) {
        // If the result is not a period, add output sample to current text
        var str = result.sample;
        var check = str.startsWith(".");

        if (check) {
          // console.log("a period!");
          autoGenerating = true; //usually this is false but i changed it to true so the program keeps running
        }

        currentText += str;
        updateTextUI();
      }
      // Update the status log
      status = 'is ready. '
      select('#status').html(status);
      runningInference = false;
    }
  }
}

function draw() {
    if(autoGenerating && modelIsReady) generateWithSingleChar();
}
