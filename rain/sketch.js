let drops = [];
let turtles = [];
let rabbits = [];

function preload() {
  url = "turtle.gif"
  // turtleImage = loadImage('turtle.gif');
  // turtleStillImage = loadImage('turtle.png');
  rabbitImage = createImg('rabbit4.gif');
  rabbitStillImage = createImg('rabbit3.png')
  turtleImage = createImg("turtle3.gif");
  turtleStillImage = createImg("turtle2.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  let dropAmount = width*7;
  let speed = 5;
  for (let i = 0; i < dropAmount; i++) {
    drops[i] = new Drop();
    drops[i].speed = speed;
  }
  
  let turtleAmount = 1;
  for (let i = 0; i < turtleAmount; i++) {
    turtles[i] = new Turtle();
  }
  
  let rabbitAmount = 1;
  for (let i = 0; i < rabbitAmount; i++) {
    rabbits[i] = new Rabbit();
  }
}

function draw() {
  
  background(141, 200, 215);
  // translate(width/2, height/2);

  
  // rotate(-80);
  // scale(0.5, 0.5);
  for (let i = 0; i < drops.length; i++) {
    drops[i].update();
    drops[i].show();
  }
  

  
  
  // mask
  fill(141, 200, 215);
  noStroke();
  rect(mouseX-50,mouseY,100,dist(0, windowHeight, 0, mouseY),50,50,0,0);
  
  // umbrella
  stroke(255);
  angleMode(DEGREES);
  arc(mouseX, mouseY+50, 100, 100, 200, 340);
  line(mouseX, mouseY+80, mouseX, mouseY);
  arc(mouseX-12, mouseY+80, 25, 25, 0, 180);

  //ground
  fill(141, 200, 215);
  noStroke();
  rect(0,height-25,width,25);
  
  
    for (i = 0; i < turtles.length; i++) {
	
    turtles[i].display();
    turtles[i].move();
    turtles[i].update();
      
  }
  
   for (i = 0; i < rabbits.length; i++) {
	
    rabbits[i].display();
    rabbits[i].move();
    rabbits[i].update();
      
  }
  
}


class Turtle {
  constructor() {
    this.x = random(0,width);
  }
  
    update() {
    if (this.x > width+100) {
    this.x = -100;
    }
    
  }

  move() {
    if (this.x < mouseX+50) {
      this.x += 0;
    }
    else{
      this.x += 0.5
    }
    
    if (this.x > mouseX-50) {
      this.x += 0;
    }
    else{
      this.x += 0.5
    }
  }

  display() {
    
  if (this.x > mouseX+50 || this.x < mouseX-50) {
     turtleImage.position(0+this.x, height-68);
    }
    else{
      turtleImage.position(-100, -100);
    }
    
  // if (){
  //   turtleImage.position(0+this.x, height-100);
  // }
   
   if (this.x < mouseX+50 && this.x > mouseX-50){
    turtleStillImage.position(0+this.x, height-68);
  }
    else{
      turtleStillImage.position(-100,-100);
    }
    
  
  }
}

class Rabbit {
  constructor() {
    this.y = random(0,width);
  }
  
    update() {
    if (this.y > width+100) {
    this.y = -100;
    }
    
  }

  move() {
    if (this.y < mouseX+50) {
      this.y += 0;
    }
    else{
      this.y += 2
    }
    
    if (this.y > mouseX-50) {
      this.y += 0;
    }
    else{
      this.y += 2
    }
  }

  display() {
    
  if (this.y > mouseX+50 || this.y < mouseX-50) {
     rabbitImage.position(0+this.y, height-78);
    }
    else{
      rabbitImage.position(-100, -100);
    }
    
  // if (){
  //   turtleImage.position(0+this.x, height-100);
  // }
   
   if (this.y < mouseX+50 && this.y > mouseX-50){
    rabbitStillImage.position(0+this.y, height-78);
  }
    else{
      rabbitStillImage.position(-100,-100);
    }
    
  
  }
}