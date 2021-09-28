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
    r = random(200, 255);
    g = random(130, 255);
    b = random(0, 255);

    r2 = random(100, 255);
    g2 = random(100, 255);
    b2 = random(200, 255);
}

let skate;
let stepSize = 5;

function setup() {
    createCanvas(windowWidth, windowHeight);
    audioSetup();
    pixelDensity(1);
    // specify multiple formats for different browsers
    skate = createVideo("../input/skate.mp4");
    skate.loop();
    skate.hide();
    skate.volume(0);
    noStroke();
    fill(0);

    emptyAudioFile = loadSound("../input/empty.mp3", loaded);
}

let r = 255;
let g = 255;
let b = 255;

let r2 = 0;
let g2 = 0;
let b2 = 0;

function draw() {
    audioDraw();
    background(r, g, b);
    detectBeat(micVolume);

    skate.loadPixels();

    // const stepSize = round(constrain(mouseX / 8, 6, 32));
    stepSize = floor(map(micVolume, 0, 1, 10, 20));

    for (let y = 0; y < height; y += stepSize) {
        for (let x = 0; x < width; x += stepSize) {
            let i = y * width + x;
            let darkness = (255 - skate.pixels[i * 4]) / 200;
            let radius = stepSize * darkness;
            fill(r2, g2, b2);
            ellipse(x, y, radius, radius * map(micVolume, 0, 1, 1, 10));
            //FOR HORIZONTAL VERSION
            //ellipse(x, y, radius * map(micVolume * 10, 0, 1, 1, 10), radius);
        }
    }
}

function mousePressed() {
    r = random(0, 255);
    g = random(0, 255);
    b = random(0, 255);

    r2 = random(0, 255);
    g2 = random(0, 255);
    b2 = random(0, 255);
}
