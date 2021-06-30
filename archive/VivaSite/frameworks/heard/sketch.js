let counter = 0;
let spr;
const array = [...'hello'];
let a = 'type';
let r = 255;
let g = 255;
let b = 200;

function preload() {
  // specify width and height of each frame and number of frames
  firstSprite = loadAnimation('first/first-1.png', 'first/first-2.png',
                              'first/first-3.png', 'first/first-4.png',
                              'first/first-5.png', 'first/first-6.png');
  secondSprite = loadAnimation('second/second-1.png', 'second/second-2.png',
                              'second/second-3.png', 'second/second-4.png',
                              'second/second-5.png', 'second/second-6.png');
  thirdSprite = loadAnimation('third/third-1.png', 'third/third-2.png',
                              'third/third-3.png', 'third/third-4.png',
                              'third/third-5.png', 'third/third-6.png');
  fourthSprite = loadAnimation('fourth/fourth-1.png', 'fourth/fourth-2.png',
                              'fourth/fourth-3.png', 'fourth/fourth-4.png',
                              'fourth/fourth-5.png', 'fourth/fourth-6.png');
  fifthSprite = loadAnimation('fifth/fifth-1.png', 'fifth/fifth-2.png',
                              'fifth/fifth-3.png', 'fifth/fifth-4.png',
                              'fifth/fifth-5.png', 'fifth/fifth-6.png');
  sixthSprite = loadAnimation('sixth/sixth-1.png', 'sixth/sixth-2.png',
                              'sixth/sixth-3.png', 'sixth/sixth-4.png',
                              'sixth/sixth-5.png', 'sixth/sixth-6.png');                           
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //create sprite with multiple image options
  spr = createSprite(width/2 - 100, height/2);  //spr.debug = true;
  spr.addAnimation('first', firstSprite);
  spr.addAnimation('second', secondSprite);
  spr.addAnimation('third', thirdSprite);
  spr.addAnimation('fourth', fourthSprite);
  spr.addAnimation('fifth', fifthSprite);
  spr.addAnimation('sixth', sixthSprite);
  
  spr2 = createSprite(width / 2 + 100, height / 2);  //spr.debug = true;
  spr2.addAnimation('first', firstSprite);
  spr2.addAnimation('second', secondSprite);
  spr2.addAnimation('third', thirdSprite);
  spr2.addAnimation('fourth', fourthSprite);
  spr2.addAnimation('fifth', fifthSprite);
  spr2.addAnimation('sixth', sixthSprite);
  spr2.mirrorX (-1);

  //create animated character
  // spr2 = createSprite(200, 250);   //spr2.debug = true;
  // spr2.addAnimation('walker', firstSprite);
}

function draw() {
  //test for overlap of image pixels


  if (keyIsPressed === true) {
    counter++;
  } else if (counter > 0) {
    counter--;
  }
  

  if (counter > 500) {
    spr.changeAnimation('sixth');
  } else if (counter > 400) {
    spr.changeAnimation('fifth');
  } else if (counter > 300) {
    spr.changeAnimation('fifth');
  } else if (counter > 200) {
    spr.changeAnimation('fourth');
  } else if (counter > 100) {
    spr.changeAnimation('third');
  } else if (counter > 50) {
    spr.changeAnimation('second');
  } else {
    spr.changeAnimation('first');
  }

  if (counter > 600) {
    spr2.changeAnimation('sixth');
  } else if (counter > 500) {
    spr2.changeAnimation('fifth');
  } else if (counter > 400) {
    spr2.changeAnimation('fifth');
  } else if (counter > 300) {
    spr2.changeAnimation('fourth');
  } else if (counter > 200) {
    spr2.changeAnimation('third');
  } else if (counter > 100) {
    spr2.changeAnimation('second');
  } else {
    spr2.changeAnimation('first');
  }

  if (counter > 500) {
    a = 'MOOOOOREEE';
    textSize(100);
  } else if (counter > 400) {
    a = 'AAHHHHH';
    textSize(70);
  } else if (counter > 300) {
    a = 'MOOORE';
    textSize(50);
  } else if (counter > 200) {
    a = 'type MORE';
    textSize(40);
  } else if (counter > 150) {
    a = 'type moore';
    textSize(30);
  } else if (counter > 100) {
    a = 'type more';
    textSize(20);
  } else {
    a = 'type'
  }


  if (counter > 600) {
    r = 255;
    g = 80;
    b = 41;
  } else if (counter > 500) {
    r = 255;
    g = 120;
    b = 56;
  } else if (counter > 400) {
    r = 255;
    g = 153;
    b = 72;
  } else if (counter > 300) {
    r = 255;
    g = 171;
    b = 81;
  } else if (counter > 200) {
    r = 255;
    g = 188;
    b = 91;
  } else if (counter > 100) {
    r = 255;
    g = 210;
    b = 105;
  } else if (counter > 50) {
    r = 255;
    g = 230;
    b = 117;
  } else {
    r = 255;
    g = 255;
    b = 200;
  }

  

  console.log(counter);
  console.log(array);

  background(r,g,b); 
  drawSprites();
  fill(0);
  textAlign(CENTER);
  text(a, width/2, height/2);
  

  
}

