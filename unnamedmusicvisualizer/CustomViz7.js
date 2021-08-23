/* =============== */
/*    VARIABLES    */
/* =============== */

let mic;
let song;
let button;
let playing;

//FFT
let fft;
let spectrum;
let binAmplitude
let bass, lowMid, mid, highMid, treble;
let waveform

//AMPLITUDE
let amplitude;
let level
let levelHistory = new Array(30);


//BEAT DETECT

// how many draw loop frames before the beatCutoff starts to decay
// so that another beat can be triggered.
// frameRate() is usually around 60 frames per second,
// so 20 fps = 3 beats per second, meaning if the song is over 180 BPM,
// we wont respond to every beat.
let beatHoldFrames = 30;

// what amplitude level can trigger a beat?
let beatThreshold = 0.3; 

// When we have a beat, beatCutoff will be reset to 1.1*beatThreshold, and then decay
// Level must be greater than beatThreshold and beatCutoff before the next beat can trigger.
let beatCutoff = 0;
let beatDecayRate = 0.98; // how fast does beat cutoff decay?
let framesSinceLastBeat = 0; // once this equals beatHoldFrames, beatCutoff starts to decay.


/* =============== */
/*    WORK AREA    */
/* =============== */

let inc = 0.01;
let zoff = 1;

let strobeToggleButton;
let strobe = false

let pixelModeSlider;

let noiseModeToggleButton;
let noiseMode = false;

let RToggleButton;
let R = true;
let Rslider;

let GToggleButton;
let G = true;
let Gslider;

let BToggleButton;
let B = true;
let Bslider;

let micThresholdslider;



function setup() {
    createCanvas(400, 400);
    // angleMode(DEGREES)
    // colorMode(HSB);

    mic = new p5.AudioIn();
    mic.start();

    song = loadSound("empty.mp3", loaded);

    createFFT()
    createAmplitude()

    pixelDensity(1);

    strobeToggleButton = createButton('strobe toggle')
    strobeToggleButton.mousePressed(toggleStrobe);

    createP("pixel slider");
    pixelModeSlider = createSlider(4, 30, 8,1);

    noiseModeToggleButton = createButton("noise mode");
    noiseModeToggleButton.mousePressed(toggleNoise);

    RButton = createButton("R");
    RButton.mousePressed(toggleRed);
    Rslider = createSlider(0, 255, 0);
    GButton = createButton("G");
    GButton.mousePressed(toggleGreen);
    Gslider = createSlider(0, 255, 0);
    BButton = createButton("B");
    BButton.mousePressed(toggleBlue);
    Bslider = createSlider(0, 255, 0);

    createP("mic threshold slider");
    micThresholdslider = createSlider(0,1,0.4,0.05)
}

let simplex = new SimplexNoise(12345);

function draw() {
    background(0);

    getMicVolume();
    micInputScaled = map(micVolume,0,micThresholdslider.value(),0.001,0.5)

    let yoff = 0;
    loadPixels();
    for (let y = 0; y < height; y+=2) {
        let xoff = 0;
        for (let x = 0; x < width; x+=2) {
            let index
            let noiseValue
            let pixelValue

            if (strobe) {
                //STROBE true
                index = (x + y * width) * floor(map(micVolume, 0, 0.3, 4, 24));
            } else {
                //NORMAL false
                index = (x + y * width) * pixelModeSlider.value();
            }

            if (noiseMode) {
                //SIMPLEX
                noiseValue = simplex.noise3D(xoff, yoff, zoff) * 255;
                //THRESHOLD
                pixelValue = map(noiseValue, 30, 50, 0, 255);
            } else {
                //PERLIN
                noiseValue = noise(xoff, yoff, zoff) * 255;
                //THRESHOLD
                pixelValue = map(noiseValue, 100, 100, 0, 255);
            }

            if (R) {
                pixels[index + 0] = pixelValue + Rslider.value()
            } else{
                pixels[index + 0] = 0 + Rslider.value()
            }

            if (G) {
                pixels[index + 1] = pixelValue + Gslider.value()
            } else {
                pixels[index + 1] = 0 + Gslider.value()
            }

            if (B) {
                pixels[index + 2] = pixelValue +Bslider.value()
            } else {
                pixels[index + 2] = 0 + Bslider.value();
            }
            
            pixels[index + 3] = 255;

            xoff += inc;
        }
        yoff += inc;
    }

    zoff += micInputScaled ;
    
    updatePixels();
}

function toggleStrobe(){
    if (strobe) {
        strobe = false;
        strobeToggleButton.html("strobe toggle: off");
    } else {
        strobe = true;
        strobeToggleButton.html("strobe toggle: on");
    }
}

function toggleNoise() {
    if (noiseMode) {
        noiseMode = false;
        noiseModeToggleButton.html("noise mode: perlin");
    } else {
        noiseMode = true;
        noiseModeToggleButton.html("noise mode: simplex");
    }
}

function toggleRed() {
    if (R) {
        R = false;
        RButton.html("R: off");
    } else {
        R = true;
        RButton.html("R: on");
    }
}

function toggleGreen() {
    if (G) {
        G = false;
        GButton.html("G: off");
    } else {
        G = true;
        GButton.html("G: on");
    }
}

function toggleBlue() {
    if (B) {
        B = false;
        BButton.html("B: off");
    } else {
        B = true;
        BButton.html("B: on");
    }
}

/* ================ */
/* CUSTOM FUNCTIONS */
/* ================ */

function createMic(){
    //create new p5 audioIn object
    //remember to put this function in set up
    mic = new p5.AudioIn();
    mic.start();
}

function getMicVolume(){
    //stores mic levels in variable micVolume
    //values range from 0 to 1
    micVolume = mic.getLevel();
}


function loaded() {
    button = createButton("enable mic");
    button.mousePressed(toggleSong);
}

function toggleSong() {
    if (playing) {
        song.pause();
        playing = false;
    } else {
        song.play();
        playing = true;
    }
}


/* ========= */
/* AMPLITUDE */
/* ========= */


function createAmplitude() {
    // creates p5 amplitude constructor
    // remember to call this function in setup
    amplitude = new p5.Amplitude();
}

function getAmplitudeLevel(){
    // remember to delare global variable: let level;
    // stores amplitude values in variable level
    // values range from 0 to 1 but realistically from 0 to 0.6~
    level = amplitude.getLevel();
}

function recordLevelHistory(){
    // remember to define: let levelHistory = new Array(length of array);
    // add new level to end of array
    levelHistory.push(level);

    // remove first item in array
    levelHistory.splice(0, 1);
}

function drawLevelHistory(){
    // loop through levelHistory[]
    for (let i = 0; i < levelHistory.length; i++) {
        rectMode(CENTER);

        let x = map(i, levelHistory.length, 0, width / 2, width);
        let h = map(levelHistory[i], 0, 0.5, 2, height);

        let spacing = 10;
        let w = width / (levelHistory.length * spacing);

        fill(0);
        rect(x, height / 2, w, h);
        rect(width - x, height / 2, w, h);
    }
}

/* ==========*/
/*    FFT    */
/* ========= */

function createFFT(){
    // remember to call this function in setup
    // creates new p5 FFT constructor
    fft = new p5.FFT();
}

function FFTAnalyse() {
    // remember to delare global variable: let spectrum;
    // stores FFT analysis array in variable spectrum
    spectrum = fft.analyze();
}

function FFTdrawSpectrum(){
    for (let i = 0; i < spectrum.length; i++) {
        let binAmplitude = spectrum[i];
        let binHeight = map(binAmplitude, 0, 256, height, 0);
        w = width / 1024;
        rect(i * w, binHeight, w, height - binHeight);
    }
}

function FFTgetEnergy() {
    //remember to define global vairables: let bass, lowMid, mid, highMid, treble;
    // stores volume at a specific frequency in respective variables
    // values go from 0 to 255
    bass = fft.getEnergy("bass");
    lowMid = fft.getEnergy("lowMid");
    mid = fft.getEnergy("mid");
    highMid = fft.getEnergy("highMid");
    treble = fft.getEnergy("treble");
}

function FFTgetWaveform() {
    //remember to define global variable: let waveform;
    // stores FFT waveform data in variable waveform 
    waveform = fft.waveform();
}

function FFTdrawWaveform(){
        beginShape();
        for (let i = 0; i < waveform.length; i++) {
            let x = map(i, 0, waveform.length, 0, width);
            let y = map(waveform[i], -1, 1, 0, height);
            vertex(x, y);
        }
        endShape();
}

/* =========== */
/* BEAT DETECT */
/* =========== */

function detectBeat(level) {
    //level should be from 0 to 1 (realistically 0 to 0.6~)
    //detect if level exceeds beatThreshold and beatCutoff
    //if not advance the frames
    if (level > beatCutoff && level > beatThreshold) {
        onBeat();
        beatCutoff = level * 1.1;
        framesSinceLastBeat = 0;
    } else {
        if (framesSinceLastBeat <= beatHoldFrames) {
            framesSinceLastBeat++;
        } else {
            beatCutoff *= beatDecayRate;
            beatCutoff = Math.max(beatCutoff, beatThreshold);
        }
    }
}

function onBeat() {
    //define what should happen onBeat here

}