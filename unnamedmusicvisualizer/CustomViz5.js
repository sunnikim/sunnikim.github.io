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
let binAmplitude;
let bass, lowMid, mid, highMid, treble;
let waveform;

//AMPLITUDE
let amplitude;
let level;
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

let levelAccum = 0;
let colourSlider
let vertexSlider;
let strokeWeightSlider;
let alphaSlider;

function setup() {
    createCanvas(500, 500, WEBGL);
    angleMode(DEGREES);
    colorMode(HSB,360,100,100,255);

    mic = new p5.AudioIn();
    mic.start();

    song = loadSound("empty.mp3", loaded);

    createFFT();
    createAmplitude();
    createP("color slider");
    colourSlider = createSlider(0,360,0)
    createP("vertex slider");
    vertexSlider = createSlider(3, 24, 6);
    createP("vertex color slider");
    vertexColourSlider = createSlider(0, 360, 200);
    createP("stroke weight slider");
    strokeWeightSlider = createSlider(1, 1000, 1);
    createP("alpha slider");
    alphaSlider = createSlider(0, 255, 255);


}

function draw() {
    background(0);

    let vertexDetail = vertexSlider.value()
    let strokeWeightValue = strokeWeightSlider.value()
    let alphaValue = alphaSlider.value();

    getAmplitudeLevel();
    getMicVolume();

    levelAccum = levelAccum + micVolume;

    print(levelAccum);

    strokeWeight(strokeWeightValue)
    fill(vertexColourSlider.value(),100,100)

    push();
    stroke(colourSlider.value(), 100, 100, alphaValue);
    rotateX(levelAccum * 10);
    rotateY(levelAccum * 10);
    torus(map(micVolume, 0, 0.5, 25, 100), 0.5, vertexDetail);
    pop();

    push();
    stroke(colourSlider.value(), 100, 100, alphaValue);
    rotateX(levelAccum * 10);
    rotateY(- levelAccum * 10);
    torus(map(micVolume, 0, 0.5, 50, 200), 0.5, vertexDetail);
    pop();

    push();
    stroke(colourSlider.value(), 100, 100, alphaValue);
    rotateX(levelAccum * 10);
    rotateZ(levelAccum * 10);
    torus(map(micVolume, 0, 0.5, 75, 250), 0.5, vertexDetail);
    pop();
}

/* ================ */
/* CUSTOM FUNCTIONS */
/* ================ */

function createMic() {
    //create new p5 audioIn object
    //remember to put this function in set up
    mic = new p5.AudioIn();
    mic.start();
}

function getMicVolume() {
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

function getAmplitudeLevel() {
    // remember to delare global variable: let level;
    // stores amplitude values in variable level
    // values range from 0 to 1 but realistically from 0 to 0.6~
    level = amplitude.getLevel();
}

function recordLevelHistory() {
    // remember to define: let levelHistory = new Array(length of array);
    // add new level to end of array
    levelHistory.push(level);

    // remove first item in array
    levelHistory.splice(0, 1);
}

function drawLevelHistory() {
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

function createFFT() {
    // remember to call this function in setup
    // creates new p5 FFT constructor
    fft = new p5.FFT();
}

function FFTAnalyse() {
    // remember to delare global variable: let spectrum;
    // stores FFT analysis array in variable spectrum
    spectrum = fft.analyze();
}

function FFTdrawSpectrum() {
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

function FFTdrawWaveform() {
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
