var video
var button
var snapshots = [];
let trans = 255
var guess = 0;
var click;


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(51);
  video = createCapture(VIDEO, ready);
  video.size(width-300, height);
  video.hide();
  button = createButton('snap');
  button.position(width/2.1, height-100);
  button.size(50, 50);
  button.mousePressed(takesnap);
  stroke(255, 0, 0);
  strokeWeight(2);
  noFill();
  textSize(50);
  textAlign(CENTER);
  textStyle(BOLD);
  text('1', width * 0.25, height / 1.7);
  stroke(255, 0, 0);
  strokeWeight(2);
  noFill();
  textSize(50);
  textAlign(CENTER);
  textStyle(BOLD);
  text('2', width * 0.5, height / 1.7);
  stroke(255, 0, 0)
  noFill();
  strokeWeight(2);  
  textSize(50);
  textAlign(CENTER);
  textStyle(BOLD);
  text('3', width * 0.75, height / 1.7);
}

let go = false;

function ready() {
  go = true;

}

function show() {
  imageMode(CENTER);
  image(video, width/2, height/2);
}

function takesnap() {
  snapshots.push(video.get())
  setTimeout(show, 4000)
  setTimeout(one, 0)
  setTimeout(two, 1000)
  setTimeout(three, 2000)
  setTimeout(smile, 3000)
  setTimeout(photo, 5000)

}

function one() {
  fill(255,0,0)
  textSize(50);
  textAlign(CENTER);
  textStyle(BOLD);
  text('1', width*0.25, height/1.7);
}

function two() {
  fill(255,0,0)
  textSize(50);
  textAlign(CENTER);
  textStyle(BOLD);
  text('2', width*0.5, height/1.7);
}

function three() {
  fill(255,0,0)
  textSize(50);
  textAlign(CENTER);
  textStyle(BOLD);
  text('3', width*0.75, height/1.7);
}

function smile() {
  fill(255,0,0)
  noStroke();
  textSize(60);
  textAlign(CENTER);
  textStyle(BOLD);
  text('smile!', width*0.5, height/2);
}

function photo() {
  fill(255,0,0)
  noStroke();
  textSize(70);
  textAlign(CENTER);
  textStyle(BOLD);
  text('take a selfie :>', width*0.5, height/3);
}