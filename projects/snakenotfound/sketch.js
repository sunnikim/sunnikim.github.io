/*
 * @name Snake game
 * @description The famous snake game! Once you click run, click anywhere
 * inside the black area, and control the snake using i j k and l. Don't let
 * the snake hit itself or the wall!<br>
 * Example created by <a href='https://github.com/prashantgupta24' target='_blank'>Prashant Gupta
*/

// the snake is divided into small segments, which are drawn and edited on each 'draw' call
var numSegments = 4;
var direction = 'right';

var xStart = 0; //starting x coordinate for snake
var yStart = 250; //starting y coordinate for snake
var diff = 10;

//xcoordinate
//ycoordinate
var xCor = [];
var yCor = [];

var xFruit = 0;
var yFruit = 0;
var scoreElem;
//scoreElement
var notFound;



function setup() {
  

  textFont('Helvetica,sans-serif');
  scoreElem = createDiv('Score : 0');
  scoreElem.position(window.innerWidth*0.35, 70);
  scoreElem.id = 'score';
  scoreElem.style('color', 'white');
  
  
  createCanvas(500, 500);
  frameRate(15);
  fill(35, 35, 35);
  
  
  
  updateFruitCoordinates();

  for (var i = 0; i < numSegments; i++) {
    xCor.push(xStart + (i * diff));
    yCor.push(yStart);
  }
}

function draw() {
  
  background('black');
  stroke('#ffffff');
  noFill();
  rect(0,0,499,499);
	//0 is smaller than number of segments - 1

  for (var i = 0; i < numSegments - 3; i++) {
    
    text('0',xCor[i+1],yCor[i+1])
 
    var snakeHeadX = xCor[xCor.length - 2];
 
    var snakeHeadY = yCor[yCor.length - 2];
 
    text('4',snakeHeadX, snakeHeadY);
    
     var snakeTailX = xCor[xCor.length-numSegments];
    var snakeTailY = yCor[yCor.length-numSegments];
    fill(255);
    text('4',snakeTailX, snakeTailY);
    
  }
    
   
function noscroll() {
  window.scrollTo( 0, 0 );
}

// add listener to disable scroll
window.addEventListener('scroll', noscroll);
    
  
  
    
  updateSnakeCoordinates();
  checkGameStatus();
  checkForFruit();
}

/*
 The segments are updated based on the direction of the snake.
 All segments from 0 to n-1 are just copied over to 1 till n, i.e. segment 0
 gets the value of segment 1, segment 1 gets the value of segment 2, and so on,
 and this results in the movement of the snake.

 The last segment is added based on the direction in which the snake is going,
 if it's going left or right, the last segment's x coordinate is increased by a
 predefined value 'diff' than its second to last segment. And if it's going up
 or down, the segment's y coordinate is affected.
*/
function updateSnakeCoordinates() {

  for (var i = 0; i < numSegments - 1; i++) {
    xCor[i] = xCor[i + 1];
    yCor[i] = yCor[i + 1];
    
   
  }
  switch (direction) {
    case 'right':
      xCor[numSegments - 1] = xCor[numSegments - 2] + diff;
      yCor[numSegments - 1] = yCor[numSegments - 2];
      break;
    case 'up':
      xCor[numSegments - 1] = xCor[numSegments - 2];
      yCor[numSegments - 1] = yCor[numSegments - 2] - diff;
      break;
    case 'left':
      xCor[numSegments - 1] = xCor[numSegments - 2] - diff;
      yCor[numSegments - 1] = yCor[numSegments - 2];
      break;
    case 'down':
      xCor[numSegments - 1] = xCor[numSegments - 2];
      yCor[numSegments - 1] = yCor[numSegments - 2] + diff;
      break;
  }
}

/*
 I always check the snake's head position xCor[xCor.length - 1] and
 yCor[yCor.length - 1] to see if it touches the game's boundaries
 or if the snake hits itself.
*/
function checkGameStatus() {
  if (xCor[xCor.length - 1] > width ||
      xCor[xCor.length - 1] < 0 ||
      yCor[yCor.length - 1] > height ||
      yCor[yCor.length - 1] < 0 ||
      checkSnakeCollision()) {
    noLoop();
    var scoreVal = parseInt(scoreElem.html().substring(8));
    scoreElem.html('Your score : ' + scoreVal);
  }
}

/*
 If the snake hits itself, that means the snake head's (x,y) coordinate
 has to be the same as one of its own segment's (x,y) coordinate.
*/
function checkSnakeCollision() {
  var snakeHeadX = xCor[xCor.length - 1];
  var snakeHeadY = yCor[yCor.length - 1];
  for (var i = 0; i < xCor.length - 1; i++) {
    if (xCor[i] === snakeHeadX && yCor[i] === snakeHeadY) {
      return true;
    }
  }
}

/*
 Whenever the snake consumes a fruit, I increment the number of segments,
 and just insert the tail segment again at the start of the array (basically
 I add the last segment again at the tail, thereby extending the tail)
*/
function checkForFruit() {
  text('0',xFruit, yFruit);
  if (xCor[xCor.length - 1] === xFruit && yCor[yCor.length - 1] === yFruit) {
    var prevScore = parseInt(scoreElem.html().substring(8));
    scoreElem.html('Score : ' + (prevScore + 1));
    xCor.unshift(xCor[0]);
    yCor.unshift(yCor[0]);
    numSegments++;
    updateFruitCoordinates();
  }
}

function updateFruitCoordinates() {
  /*
    The complex math logic is because I wanted the point to lie
    in between 100 and width-100, and be rounded off to the nearest
    number divisible by 10, since I move the snake in multiples of 10.
  */

  xFruit = floor(random(10, (width - 100) / 10)) * 10;
  yFruit = floor(random(10, (height - 100) / 10)) * 10;
}

function keyPressed() {
  switch (keyCode) {
    case LEFT_ARROW:
      if (direction != 'right') {
        direction = 'left';
      }
      break;
    case RIGHT_ARROW:
      if (direction != 'left') {
        direction = 'right';
      }
      break;
    case UP_ARROW:
      if (direction != 'down') {
        direction = 'up';
      }
      break;
    case DOWN_ARROW:
      if (direction != 'up') {
        direction = 'down';
      }
      break;
  }
}
