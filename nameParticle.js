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
let numBalls = 5;
let spring = 0.005;
let gravity = 0.1;
let friction = -0.9;
let balls = [];
let characters = ["ㄱ", "ㅅ" ,"ㅓ", "ㅁ","ㅣ","ㄴ"];
let words = ["김", "선", "민"];

function setup() {
    createCanvas(windowWidth/2, windowHeight/2);
    for (let i = 0; i < 50; i++) {
        balls[i] = new Ball(
            random(width),
            random(height),
            25,
            i,
            balls,
            random(255),
            random(words)
        );
    }
    noStroke();
    fill(255);

}

function mousePressed(){
    for (let i = 0; i < balls.length; i++) {
        balls[i].blow(random(-10, 10));
    }
    
}

function draw() {

    
    background(255);
    balls.forEach((ball) => {
        ball.collide();
        ball.move();
        ball.display();
    });
}

class Ball {
    constructor(xin, yin, din, idin, oin, col, char) {
        this.x = xin;
        this.y = yin;
        this.vx = 0;
        this.vy = 0;
        this.diameter = din;
        this.id = idin;
        this.others = oin;
        this.col = col;
        this.char = char;
    }

    collide() {
        for (let i = this.id + 1; i < balls.length; i++) {
            // console.log(others[i]);
            let dx = this.others[i].x - this.x;
            let dy = this.others[i].y - this.y;
            let distance = dist(
                this.x,
                this.y,
                this.others[i].x,
                this.others[i].y
            );
            let minDist = this.others[i].diameter / 2 + this.diameter / 2;
            //   console.log(distance);
            //console.log(minDist);
            if (distance < minDist) {
                //console.log("2");
                let angle = atan2(dy, dx);
                let targetX = this.x + cos(angle) * minDist;
                let targetY = this.y + sin(angle) * minDist;
                let ax = (targetX - this.others[i].x) * spring;
                let ay = (targetY - this.others[i].y) * spring;
                this.vx -= ax;
                this.vy -= ay;
                this.others[i].vx += ax;
                this.others[i].vy += ay;
            }
        }
    }

    move() {
        this.vy += gravity;
        this.x += this.vx;
        this.y += this.vy;
        if (this.x + this.diameter / 2 > width) {
            this.x = width - this.diameter / 2;
            this.vx *= friction;
        } else if (this.x - this.diameter / 2 < 0) {
            this.x = this.diameter / 2;
            this.vx *= friction;
        }
        if (this.y + this.diameter / 2 > height) {
            this.y = height - this.diameter / 2;
            this.vy *= friction;
        } else if (this.y - this.diameter / 2 < 0) {
            this.y = this.diameter / 2;
            this.vy *= friction;
        }
    }

    display() {
        fill(0);
        textSize(this.diameter);
        text(this.char, this.x, this.y);
        // ellipse(this.x, this.y, this.diameter, this.diameter);
    }

    blow(blow) {
        this.vy += blow;
        this.vx += blow;
    }
}

// function setup() {
//     createCanvas(500, 500);
//     angleMode(DEGREES);
//     colorMode(HSB);

//     mic = new p5.AudioIn();
//     mic.start();

//     song = loadSound("monsune.mp3", loaded);

//     createFFT();
//     createAmplitude();
    
    
    
// }

//    let inc = 0;
//    let movers = []

// function draw() {
//     background(255);
 
//     let gravity = createVector(0, 1);
//     let push = createVector(0.01, 0.1);

//     for (let i = 0; i < movers.length; i++) {
//         movers[i].applyForce(gravity);
//         movers[i].update();
//         movers[i].edges();
//         movers[i].show();
//         for (let j = 0; j < movers.length; j++) {
//             if (i!=j) {
//                 movers[i].intersects(movers[j]);
//             }
//         }
//     }
// }

// function mousePressed(){
//     movers.push(new Hangul(mouseX,200))
// }

// class Hangul {
//     constructor(x, y) {
//         this.pos = createVector(x, y);
//         this.vel = createVector(0, 0);
//         this.acc = createVector(0, 0);
//         this.r = 16;
//     }

//     applyForce(force) {
//         this.acc.add(force);
//     }

//     edges() {
//         if (this.pos.y >= height - this.r) {
//             this.pos.y = height - this.r;
//             this.vel.y *= -0.6;
//         }

//         if (this.pos.x >= width - this.r) {
//             this.pos.x = width - this.r;
//             this.vel.x *= -1;
//         } else if (this.pos.x <= this.r) {
//             this.pos.x = this.r;
//             this.vel.x *= -1;
//         }
//     }

//     update() {
//         this.vel.add(this.acc);
//         this.pos.add(this.vel);
//         this.acc.set(0, 0);
//     }

//     show() {
//         stroke(0);
//         strokeWeight(2);
//         fill(255, 100);
//         ellipse(this.pos.x, this.pos.y, this.r * 2);
//     }

//     intersects(other) {
//         let d = dist(this.pos.x,this.pos.y,other.pos.x,other.pos.y)
//         let dx = other.pos.x - this.pos.x;
//         let dy = other.pos.y - this.pos.y;
//         if(d < this.r + other.r){
//             let angle = atan2(dy, dx);
//             let targetX = this.x + cos(angle) * this.r + other.r;
//             let targetY = this.y + sin(angle) * this.r + other.r;
//             let ax = (targetX - other.pos.x) * 0.05;
//             let ay = (targetY - other.pos.y) * 0.05;
//             this.vel.sub(ax,ay) 
//             other.vel.add(ax,ay)
//         }
//     }

//     // LOOK HERE :( https://p5js.org/examples/motion-bouncy-bubbles.html


//     changeColor(){
//         fill(random(255))
//     }
// }

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
    button = createButton("play");
    button.mousePressed(toggleSong);
}

function toggleSong() {
    if (playing) {
        song.pause();
        playing = false;
        button.html("play");
    } else {
        song.play();
        playing = true;
        button.html("pause");
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
