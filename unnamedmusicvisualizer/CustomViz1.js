let incr = 0.01
let start = 0

let mic
let song;
let button;
let playing;
let fft;

let levelHistory = [];

let spacingSlider;
let skewSlider;

let colourSlider;

function setup() {
    colorMode(HSB)
    createCanvas(400,600)
    song = loadSound('empty.mp3', loaded)
        
    mic = new p5.AudioIn();
    mic.start();

    fft = new p5.FFT(0.5, 64);
    amplitude = new p5.Amplitude();

    createP("spacing FIX LATER");
    spacingSlider = createSlider(0.05,20,3,0.05)
    createP("skew slider FIX LATER");
    skewSlider = createSlider(1, 1000, 50);
    createP('colour slider FIX LATER')
    colourSlider = createSlider(0,360,0)
    createP("alpha slider FIX LATER");
    alphaSlider = createSlider(0, 1, 1,0.05);

    createP("stroke weight");
    strokeWeightSlider = createSlider(1, 100, 1);

    createP("shift slider");
    extendSlider = createSlider(-2, 7, 2);

    createP("legnth slider");
    lengthSlider = createSlider(40, 400, 200);
}

function draw() {
    background(0)

    let spectrum = fft.analyze();

    fill(255)
    stroke(0, 200, 255)

    let yOffset = 50
    let noiseOffset = start

    //NOISE VIZ
    
    // for (let y = yOffset; y < height - yOffset; y++) {
    //     line(noise(noiseOffset) * width - 50, y, noise(noiseOffset) * width + 50, y + 50);
    //     noiseOffset += incr
    // }
    
    // start += incr


    let level = mic.getLevel();

    let spacing = spacingSlider.value()
    let skewOffset = skewSlider.value()

   

    levelHistory.push(level);

    for (let i = 0; i < levelHistory.length; i++) {
        // let y = map(i, levelHistory.length, 0, 0, height);
        let colLevel = map(
            levelHistory[i],
            0,
            0.3,
            (0 + colourSlider.value()),
            (360 + colourSlider.value())
        );
        
        strokeWeight(strokeWeightSlider.value())
        stroke(colLevel, 100, 100,alphaSlider.value());

        lerpLevel = lerp(levelHistory[i], levelHistory[i+1], 0.9);
        let xDis = map(lerpLevel, 0, 1, 0, width*extendSlider.value());

        line(20 + xDis, i * spacing, lengthSlider.value() + xDis, i * spacing + skewOffset);
    }

    if (levelHistory.length > height/spacing - 50/spacing) {
        levelHistory.splice(0, 1);
    }


        // for (let i = 0; i < spectrum.length; i++) {
        //     let amp = spectrum[i];
        //     let x = map(amp, 0, 256, 0, height);
        //     let y = height / spectrum.length 
        //     fill(i, 255, 255);
        //     line(50, i * y, x + 100, i * y)
        // }

        


        // let amp;
        // let x

        // for (let i = 0; i < spectrum.length; i++) {
        //     amp = spectrum[i];
        //     x = map(amp, 0, 256, height, 0);
        // }

        // for (let y = 0; y < height; y++) {
            
        //     line(0, y, width - 50, y);
        // }
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