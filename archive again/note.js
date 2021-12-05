let timer = 0
let sun = document.querySelector('#sun')
let min = document.querySelector("#min");
let kim = document.querySelector("#kim");
let yu = document.querySelector("#yu");
let ri = document.querySelector("#ri");
let su = document.querySelector("#su");
let zu = document.querySelector("#zu");
let ki = document.querySelector('#ki')
let noteAlert = document.querySelector(".note-alert");


sun.addEventListener('click',playSun)
min.addEventListener("click", playMin);
kim.addEventListener("click", playKim);
yu.addEventListener("click", playYu);
ri.addEventListener("click", playRi);
su.addEventListener("click", playSu);
zu.addEventListener("click", playZu);
ki.addEventListener("click", playKi);


function playSun(){
    suSound.play()
}

function playMin() {
    minSound.play();
}

function playKim() {
    kiSound.play();
}

function playYu() {
    yuSound.play();
}

function playRi(){
    riSound.play()
}

function playSu(){
    suSound.play()
}

function playZu(){
    zuSound.play()
}

function playKi() {
    kiSound.play();
}


function setup(){

    // createCanvas(500,500)
    // background(0)

    yuSound = loadSound("sound/yu.mp3");
    riSound = loadSound("sound/ri.mp3");
    suSound = loadSound('sound/su.mp3')
    zuSound = loadSound("sound/zu.mp3");
    kiSound = loadSound("sound/ki.mp3");
    minSound = loadSound("sound/min.mp3");
}

function draw(){

}

let sTurn = true
let kTurn = true;

function keyTyped() {
    if (key === 's' || key ==='S') {
        noteAlert.classList.add("note-alert-pressed");
        suSound.play();
        if(sTurn){
            sTurn = false
            sun.classList.add("tapped");
        } else{
            sTurn = true
            su.classList.add("tapped");
        }
    } else {
        sun.classList.remove("tapped");
        su.classList.remove("tapped");
    }

    if (key === "m" || key === "M") {
        noteAlert.classList.add("note-alert-pressed");
        minSound.play();
        min.classList.add("tapped");
    } else {
        min.classList.remove("tapped");
    }

    if (key === "k" || key === "K") {
        noteAlert.classList.add("note-alert-pressed");
        kiSound.play();
        if (kTurn) {
            kTurn = false;
            kim.classList.add("tapped");
        } else {
            kTurn = true;
            ki.classList.add("tapped");
        }
    } else{
        kim.classList.remove("tapped");
        ki.classList.remove("tapped");
    }

    if (key === "y" || key === "Y") {
        noteAlert.classList.add("note-alert-pressed");
        yuSound.play();
        yu.classList.add("tapped");
    } else{
        yu.classList.remove("tapped");
    }

    if (key === "r" || key === "R") {
        noteAlert.classList.add("note-alert-pressed");
        ri.classList.add("tapped");
        riSound.play();
    } else{
        ri.classList.remove("tapped");
    }

    if (key === "z" || key === "Z") {
        noteAlert.classList.add("note-alert-pressed");
        zuSound.play();
        zu.classList.add("tapped");
    } else{
        zu.classList.remove("tapped");
    }
}