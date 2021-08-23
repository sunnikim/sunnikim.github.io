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
let beatHoldFrames = 20;

// what amplitude level can trigger a beat?
let beatThreshold = 0.1; 

// When we have a beat, beatCutoff will be reset to 1.1*beatThreshold, and then decay
// Level must be greater than beatThreshold and beatCutoff before the next beat can trigger.
let beatCutoff = 0;
let beatDecayRate = 0.98; // how fast does beat cutoff decay?
let framesSinceLastBeat = 0; // once this equals beatHoldFrames, beatCutoff starts to decay.


/* =============== */
/*    WORK AREA    */
/* =============== */



let angle = 0

let blobs = []
let amountOfBlobs = 1

let colourMax = 50

let boomSlider
let boomThreshold = 0

let boomNumSlider;

let Rslider
let R = 1
let Gslider
let G = 1
let Bslider
let B = 1


function setup() {
    for (let i = 0; i < amountOfBlobs; i++) {
        blobs[i] = new Blob(random(width), random(height));
    }

    song = loadSound("empty.mp3", loaded);
    
    
    mic = new p5.AudioIn();
    mic.start();

    createCanvas(250, 250);
    colorMode(RGB);
    
    createAmplitude();
    createFFT();
    fft.setInput(mic);

    createP('boom threshold')
    boomSlider = createSlider(50,200,100)

    createP("number of boom");
    boomNumSlider = createSlider(1, 5, 3);

    createP("R");
    Rslider = createSlider(0, 1, 1, 0.05);
    createP("G");
    Gslider = createSlider(0, 1, 1, 0.05);
    createP("B");
    Bslider = createSlider(0, 1, 1, 0.05);

}

function boom(amount){
    for (let i = 0; i < amount; i++) {
        blobs[i] = new Blob(random(width), random(height));
    }
}

function draw() {
    background(0);

    R = Rslider.value()
    G = Gslider.value()
    B = Bslider.value()

    micVolume = mic.getLevel();
    // getAmplitudeLevel();
    colourMax = micVolume * 500

    detectBeat(micVolume);
    FFTAnalyse()
    FFTgetEnergy()

    //boom threshold (0-255)
    boomThreshold = boomSlider.value()

    if (mid>boomThreshold) {
        boom(map(mid,0,200,0,boomNumSlider.value()))
    } else {
        blobs.splice(1,10)
    }

    loadPixels();
    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            let sum = 0;
            for (i = 0; i < blobs.length; i++) {
                let d = dist(x, y, blobs[i].x, blobs[i].y);
                sum += (10 * blobs[i].r) / d;
            }
            set(
                x,
                y,
                color(
                    map(sum, 0, 100, 0, colourMax)*R,
                    map(sum, 0, 100, 0, colourMax)*G,
                    map(sum, 0, 100, 0, colourMax)*B
                )
            );
        }
    }
    updatePixels();

    for (i = 0; i < blobs.length; i++) {
        blobs[i].update();
    }

}

class Blob {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        let angle = random(0, 2 * PI);
        this.xspeed = random(2, 5) * Math.cos(angle);
        this.yspeed = random(2, 5) * Math.sin(angle);
        this.r = random(120, 240);
    }

    update() {
        this.x += this.xspeed;
        this.y += this.yspeed;
        if (this.x > width || this.x < 0) this.xspeed *= -1;
        if (this.y > height || this.y < 0) this.yspeed *= -1;
    }

    show() {
        noFill();
        stroke(0);
        strokeWeight(4);
        ellipse(this.x, this.y, this.r * 2, this.r * 2);
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
        playing = false;
    } else {
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
        blobs.splice(0, 1);
        blobs.push(new Blob(random(width), random(height)));
}