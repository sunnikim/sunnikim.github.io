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

/* =============== */
/*    WORK AREA    */
/* =============== */

let theShader;
let cam

function preload() {
    theShader = loadShader(
        "01_fly_eye_mosaic/shader.vert",
        "01_fly_eye_mosaic/shader.frag"
    );
}

function setup() {
    createCanvas(500, 500, WEBGL);
    noStroke()
    emptyAudioFile = loadSound("empty.mp3");
    audioSetup();
    fft.setInput(mic);

      cam = createCapture(VIDEO);
      cam.size(windowWidth, windowHeight);
      cam.hide();
}

function draw() {
    background(240, 89, 10);
    audioDraw();

    theShader.setUniform("u_resolution", [width, height]);
    theShader.setUniform("u_time", frameCount * 0.01);
    theShader.setUniform("u_camTexture", cam);
    theShader.setUniform("u_mouseCoord", map(mouseX, 0, width, 2, 50));
    theShader.setUniform("u_micVolume", map(micVolume, 0, 1, 0, 10));

    shader(theShader);

    rect(0, 0, width, height);
    // push();
    // translate(
    //     map(mouseX, 0, width, -width / 2, width / 2),
    //     map(mouseY, 0, height, -height / 2, height / 2),
    // );
    // sphere(width / 10, 200, 200);
    // pop();
}
