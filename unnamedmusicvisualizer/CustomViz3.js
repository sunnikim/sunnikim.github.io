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

let bassXSlider;
let lowMidXSlider;
let midXSlider;
let highMidXSlider;
let trebleXSlider;

let bassYSlider;
let lowMidYSlider;
let midYSlider;
let highMidYSlider;
let trebleYSlider;

let bassColourSlider;
let lowMidColourSlider;
let midColourSlider;
let highMidColourSlider;
let trebleColourSlider;

let beatThresholdSlider;
let bpmSlider;
let bpmValueLabel;
let bpmValue = 0;

function setup() {
    createCanvas(800, 600);
    angleMode(DEGREES);
    colorMode(HSB);

    song = loadSound("empty.mp3", loaded);

    createMic();
    createFFT();
    createAmplitude();
    fft.setInput(mic);

    // for (let i = 0; i < 5; i++) {
    //    col.push(random(360))

    // }

    createP("bass: X, Y, colour");
    bassXSlider = createSlider(10, 800, 400);
    bassYSlider = createSlider(10, 600, 400);
    bassColourSlider = createSlider(0, 360, 350);
    createP("lowMid: X, Y, colour");
    lowMidXSlider = createSlider(10, 800, 400);
    lowMidYSlider = createSlider(10, 600, 400);
    lowMidColourSlider = createSlider(0, 360, 30);
    createP("mid: X, Y, colour");
    midXSlider = createSlider(10, 800, 400);
    midYSlider = createSlider(10, 600, 400);
    midColourSlider = createSlider(0, 360, 160);
    createP("highMid: X, Y, colour");
    highMidXSlider = createSlider(10, 800, 400);
    highMidYSlider = createSlider(10, 600, 400);
    highMidColourSlider = createSlider(0, 360, 200);
    createP("treble: X, Y, colour");
    trebleXSlider = createSlider(10, 800, 400);
    trebleYSlider = createSlider(10, 600, 400);
    trebleColourSlider = createSlider(0, 360, 270);

    createP("beat detect threshold");
    beatThresholdSlider = createSlider(0.1, 0.9, 0.3,0.1);
    
    bpmValueLabel = createP("BPM");
    bpmSlider = createSlider(15, 70, 30, 1);
}

let col;
let xPos = [];
let yPos = [];

function draw() {
    background(0);
    rectMode(CENTER);

    FFTAnalyse();
    FFTgetEnergy();
    getMicVolume();

    beatThreshold = beatThresholdSlider.value();
    beatHoldFrames = map(bpmSlider.value(),15,70,70,15);
    bpmValueLabel.html('BPM ' + floor((60/beatHoldFrames)*60));
    detectBeat(micVolume * 10);

    for (let i = 0; i <= 5; i++) {
        xPos.push(random(50, width - 50));
    }
    for (let i = 0; i <= 5; i++) {
        yPos.push(random(height - 50, 50));
    }

    noStroke();
    fill(bassColourSlider.value(), 70 + bass, 100, 0.5);
    rect(
        xPos[1],
        yPos[1],
        bassXSlider.value() + bass,
        bassYSlider.value() + bass
    );
    fill(lowMidColourSlider.value(), 70 + lowMid, 100, 0.5);
    rect(
        xPos[2],
        yPos[2],
        lowMidXSlider.value() + lowMid,
        lowMidYSlider.value() + lowMid
    );
    fill(midColourSlider.value(), 70 + mid, 100, 0.5);
    rect(
        xPos[3],
        yPos[3],
        midXSlider.value() + mid,
        midYSlider.value() + mid
    );
    fill(highMidColourSlider.value(), 70 + highMid, 100, 0.5);
    rect(
        xPos[4],
        yPos[4],
        highMidXSlider.value() + highMid,
        highMidYSlider.value() + highMid
    );
    fill(trebleColourSlider.value(), 70 + treble, 100, 0.5);
    rect(
        xPos[5],
        yPos[5],
        trebleXSlider.value() + treble,
        trebleYSlider.value() + treble
    );

    // for (let i = 0; i < 5; i++) {
    //     fill(col[i], 100, 100);
    //     rect(xPos[i], yPos[i], width / 5);
    // }
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
    print("beat detected");
    xPos.push(random(50, width - 50));
    xPos.splice(0, 5);
    // col = random(360)
}
