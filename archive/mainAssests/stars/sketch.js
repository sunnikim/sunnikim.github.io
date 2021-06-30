/*
 * @name Array of Objects
 * @description Create a Jitter class, instantiate an array of objects
 * and move them around the screen.
 */

let stars = [];
let shootstars = [];// array of Jitter objects


function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create objects
  for (let i = 0; i < 25; i++) {
    stars.push(new BigStar());
  }
  for (let i = 0; i < 25; i++) {
    stars.push(new SmolStar());
  }
  for (let i = 0; i < 1; i++) {
    shootstars.push(new ShootingStar());
  }
}

function draw() {
  background(0);
  for (let i = 0; i < stars.length; i++) {
    stars[i].display();
  }
  
  
   for (let i = 0; i < shootstars.length; i++) {
    shootstars[i].display();
    shootstars[i].move();
    shootstars[i].update();
  }
  
  
}

// Jitter class
class BigStar {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    // this.diameter = random(1, 5);
    // this.speed = 0.5;
  }

  // move() {
  //   this.diameter += random(-this.speed, this.speed);
  // }

  display() {
    ellipse(this.x, this.y, random(2,3), random(2,3));
    noStroke();
    fill(255)
  }
}

class SmolStar {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    // this.diameter = random(1, 5);
    // this.speed = 0.5;
  }

  // move() {
  //   this.diameter += random(-this.speed, this.speed);
  // }

  display() {
    ellipse(this.x, this.y, random(1,2), random(1,2));
    noStroke();
    fill(255)
  }
}

class ShootingStar {
  constructor() {
    this.x = random(width);
    this.y = random(0,height/2);
    // this.diameter = random(1, 5);
    this.speed = 5;
    this.limit = 0;
    this.timer = 0
  }

  move() {
    this.x -= this.speed;
    this.y += this.speed;
    this.limit += this.speed;
    this.timer += this.speed;
  }
  
  update() {
    if(this.limit > 200){
      this.x = random(width)
      this.y = random(0,height/2);
      this.limit = 0;
    }
    if (this.timer > 1000){
      this.timer = 0;
    }
  }

  display() {
    if(this.timer > 800){
    ellipse(this.x, this.y, random(1,2), random(1,2));
    noStroke();
    fill(255)
    }
    if(this.timer > 700){
    ellipse(this.x, this.y, random(1,2), random(1,2));
    noStroke();
    fill(255)
    }
  }
}
