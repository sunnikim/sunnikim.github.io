var clouds = [];
var drawing = [];
var currentPath = [];
  var delta = 0;
//tracks how long since lastframe
var lastFrame = 0;
//lastframe is when draw was last executed
var accumulator = 0;

var c1, c2;

function setup() {

  // c1 = color(255, 238, 89);
  // c2 = color(255,159,66);
	canvas = createCanvas(windowWidth, windowHeight);
    canvas.mousePressed(startPath);
  
    let cloudsAmount = 4;
  //if there is less items in the array than cloudsAmount add new cloud
    for (let i = 0; i < cloudsAmount; i++) {
    clouds[i] = new Cloud();
  }
}

function draw() {
	background(141, 200, 215);
  // setGradient(c1, c2);

  
	for (i = 0; i < clouds.length; i++) {
		var currentObj = clouds[i]; //array
		
      // cloud(currentObj.xpos, currentObj.ypos, currentObj.size);             
      
      //cloud object
		currentObj.xpos += 0.5; //speed on x axis
		currentObj.ypos += random(-0.5, 0.5); //speed on y axis
      
      clouds[i].display();
      clouds[i].move();
      clouds[i].update();
      
      
		// if (clouds[i].xpos > width+20) {
		// 	clouds.splice(i, 1);
		// } //if clouds exceed width border delete
	}
  
  
  //drawing
  if (mouseIsPressed) {
    var point = {
      x: mouseX,
      y: mouseY
    };
    currentPath.push(point);
  }

  stroke(255);
  strokeWeight(50);
  noFill();
  
  for (var i = 0; i < drawing.length; i++) {
    var path = drawing[i];
    
    beginShape();
    for (var j = 0; j < path.length; j++) {
      vertex(path[j].x +=0.5, path[j].y); //path.x moves at 0.5 speed
      
    }
    endShape();
  }
  
  
}

// function setGradient(c1, c2) {
//   // noprotect
//   noFill();
//   for (var y = 0; y < height; y++) {
//     var inter = map(y, 0, height, 0, 1);
//     var c = lerpColor(c1, c2, inter);
//     stroke(c);
//     line(0, y, width, y);
//   }
// }

function startPath() {
  currentPath = [];
  drawing.push(currentPath);
}

// function cloud(x, y, size) {
// 	fill(255, 255, 255);
//     stroke(255);
//     noSmooth();
// 	ellipse(x, y, size, size);
//     ellipse(x+5, y+10, size, size);
  
// }

class Cloud {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.diameter = random(50, 100);
    this.xadd = random(-50, 50);
    this.yadd = random(-20, 20);
  }
  
    update() {
    if (this.x > width+200) {
    this.x = random(-200,-30);
    this.y = random(height);
    this.xadd = random(-50, 50);
    this.yadd = random(-20, 20);
    }
  }

  move() {
    this.x += 0.5;
  }

  display() {
    fill(255, 255, 255);
    noStroke();
    noSmooth();
  beginShape();
    
    for(let a = 0; a < 100; a+=0.5){
      let xoff = cos(a) + 1;
      let yoff = sin(a) + 1;
      let r = map(noise(xoff, yoff ), 0 , 1 , 70 , 30 );
      let x = r * cos(a);
      let y = r * sin(a);
      vertex(x+this.x,y+this.y);
    }
    for(let a = 0; a < 100; a+=0.5){
      let xoff = cos(a) + 1;
      let yoff = sin(a) + 1;
      let r = map(noise(xoff, yoff ), 0 , 1 , 50 , 30 );
      let x = r * cos(a);
      let y = r * sin(a);
      vertex(x+this.x+50,y+this.y);
    }
    for(let a = 0; a < 100; a+=0.5){
      let xoff = cos(a) + 1;
      let yoff = sin(a) + 1;
      let r = map(noise(xoff, yoff ), 0 , 1 , 50 , 30 );
      let x = r * cos(a);
      let y = r * sin(a);
      vertex(x+this.x-50,y+this.y+10);
    }
    endShape();
  }
}

// function mouseReleased() {
// 	var newCloud = {
// 		xpos: mouseX,
// 		ypos: mouseY,
// 		size: random(30, 100)
// 	};
// 	clouds.push(newCloud);
// }