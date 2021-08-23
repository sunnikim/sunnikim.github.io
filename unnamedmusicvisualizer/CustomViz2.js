let incr = 0.01;
let start = 0;

let mic
let song;
let button;
let playing;
let fft;

let levelHistory = [];

let r = [];

function setup() {
    // colorMode(HSB);
    createCanvas(500, 500);
    angleMode(DEGREES)

    song = loadSound("empty.mp3", loaded);
        mic = new p5.AudioIn();
        mic.start();

    fft = new p5.FFT(0.5, 64);
    amplitude = new p5.Amplitude();
}

function draw() {
    background(0);

    let spectrum = fft.analyze();
    let level = mic.getLevel();

    let spacing = 3;
    let skewOffset = 50;

    levelHistory.push(level);

    let amountOfCircles = 10
   

    
    for (let a = 0; a < 180; a += 180 / 10) {
        let radius = map(sin(a), 0, 1, 10, 150);
        r.push(radius);
    }

    for (let i = 0; i < amountOfCircles; i++) {
        // let y = map(i, levelHistory.length, 0, 0, height);
        // let colLevel = map(levelHistory[i], 0, 1, 0, 360);
        // stroke(colLevel, 100, 100);
        lerpLevel = lerp(levelHistory[i], levelHistory[i + 1], 0.9);
        let spacing = 6;
        let dis = map(lerpLevel, 0, 1, 0, 400);
        let yOff = i * 2
        stroke(255)
        fill(0)
        ellipse(
            width * 0.55 - i * spacing,
            height / 2 + yOff,
            r[i] + dis,
            r[i] + dis
        );
    }


    if (levelHistory.length > amountOfCircles) {
        levelHistory.splice(0, 1);
    }
 
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
