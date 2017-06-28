// initializations
var columns = 40;
var rows = 20;
var cellWidth = 20;

var framesPerSecond = 15;

var canvas;
var ctx;
var anchor = document.getElementById("anchor");

var start_screen = document.getElementById("start-screen");

var counter;
var count = 0;
var highscoreboard;
var highscore = 0;


// generate random number between min and max
function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


var snakeColor = "orange";
var headX = randomInt(0, columns);
var headY = randomInt(0, rows);
var tail;
var snake = [{x: 0, y: 0}];
var direction = "right";


var nuggetX, nuggetY;

var bounded = false;
var relay = document.getElementById("relay");
var mySwitch = document.getElementById("switch");






// working snake generator
// working snake generator
// working snake generator
// working snake generator

// function initSnake() {
//   for (var i = 0; i < snakeLength; i++) {
//     snake.push({x: i, y: 0});
//   }
//   return snake;
// }










  // draw grid line
function drawLine(fromX, fromY, toX, toY, drawColor) {
  ctx.strokeStyle = drawColor;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX,toY);
  ctx.stroke();
}

// draw any element
function drawElement(left, top, width, height, drawColor, shadowColor, shadowBlur) {
  // sets element glow (optional)
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = shadowBlur;
  // set element color and dimensions
  ctx.fillStyle = drawColor;
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.fillRect(left, top, width, height);
  ctx.strokeRect(left, top, width, height);
}
function spawnRandomNugget() {
  nuggetX = randomInt(0, columns);
  nuggetY = randomInt(0, rows);
}


window.onload = function() {
  // dynamically add canvas element to DOM
  canvas = document.createElement("canvas");
  canvas.width = columns*cellWidth;
  canvas.height = rows*cellWidth;
  canvas.id = "canvas";
  anchor.appendChild(canvas);

  // dynamically add length counter to DOM
  counter = document.createElement("p");
  counter.style.width = columns*cellWidth + "px";
  counter.setAttribute("class", "read-out");
  counter.innerText = "length: " + snake.length;
  anchor.appendChild(counter);

  //dynamically add highscore board to DOM
  highscoreboard = document.createElement("p");
  highscoreboard.style.width = columns*cellWidth + "px";
  highscoreboard.setAttribute("class", "highscoreboard");
  highscoreboard.innerText = "best: " + highscore;
  anchor.appendChild(highscoreboard);

  // set 2D canvas context
  ctx = canvas.getContext('2d');


  // create first nugget, not yet drawn to canvas
  spawnRandomNugget();

  // create game reset function
  function gameReset() {

    // reset snake length and position and spawn fresh nugget
    headX = Math.floor(columns/2);
    headY = Math.floor(rows/2);
    snake = [{x: headX, y: headY}];
    direction = "right";
    spawnRandomNugget();

    // update the user's read-out
    counter.innerText = "length: " + snake.length;
    highscoreboard.innerText = "best: " + highscore;
    start_screen.innerText = "PRESS SPACE TO START";

    // show start_screen before fading it in or new game
    start_screen.style.display = "block";
    setTimeout(function() {
        start_screen.style.opacity = "1";
    }, 50);

    // clear interval when user loses
    clearInterval(window.interval);
    window.interval = null;
  }
  // draw everything
  // draw everything
  // draw everything
  // draw everything
  function drawEverything() {
    // console.log(`headX = ${headX}\nheadY = ${headY}\nnuggetX = ${nuggetX}\nnuggetY = ${nuggetY}`);
    // draw game board
    drawElement(0, 0, canvas.width, canvas.height, "black");
    // draw grid
    for (var i = 0; i <= columns; i++) {
        drawLine(i*cellWidth, 0, i*cellWidth, canvas.height, "rgba(255,255,255,0.1)");
        drawLine(0, i*cellWidth, canvas.width, i*cellWidth, "rgba(255,255,255,0.1)");
    }

    // draw collectible
    drawElement(nuggetX*cellWidth, nuggetY*cellWidth, cellWidth, cellWidth, "#fff", "#fff", 20);


    // draw snake
    for (i = 0; i <snake.length; i++) {
      drawElement(snake[i].x*cellWidth, snake[i].y*cellWidth, cellWidth, cellWidth, snakeColor, snakeColor, 0);
    }

  }
  function moveEverything() {


    // handle direction change
    if (direction === "right") {
      headX++;
    }
    if (direction === "down") {
      headY++;
    }
    if (direction === "up") {
      headY--;
    }
    if (direction === "left") {
      headX--;
    }

    // handle bound escapes
    if (bounded === true && (headX >= columns || headX < 0 || headY === rows || headY < 0)) {
      gameReset();
    } else if (headX >= columns) {
      headX = 0;
    } else if (headX < 0) {
      headX = columns - 1;
    } else if (headY === rows) {
      headY = 0;
    } else if (headY < 0) {
      headY = rows - 1;
    }

    // add new head, sever trailing tail
    snake.push({x: headX, y: headY});
    tail = snake.shift();

    // re-attach severed tail if nugget found, spawn new nugget
    if (nuggetX === headX && nuggetY === headY) {
      spawnRandomNugget();
      snake.unshift(tail);
      counter.innerText = "length: " + snake.length;
      count++;
    }
    // respawn nuggets falling under snake
    for (var i = 0; i < snake.length; i++) {
      if (nuggetX === snake[i].x && nuggetY === snake[i].y) {
        spawnRandomNugget();
      }
      // reset game if head runs over tail
      if (snake[i].x === headX && snake[i].y === headY && i !== snake.length-1) {
        if (count > highscore) {
            highscore = count;
        }
        gameReset();

      }
    }



  }

  moveEverything();
  drawEverything();

  // set the clock, call main functions
  // window.interval = setInterval(function() {
  //   moveEverything();
  //   drawEverything();
  // }, 1000/framesPerSecond);




  // event listeners
  // event listeners
  // event listeners
  // event listeners

  document.body.addEventListener('keydown', function(e) {

    switch (e.keyCode) {
      case 37: // disallow reversing direction unless of length 1
        if (direction !== "right" || snake.length === 1) {
          direction = "left";
        }
      break;

      case 38: // disallow reversing direction unless of length 1
        if (direction !== "down" || snake.length === 1) {
          direction = "up";
        }
      break;

      case 39: // disallow reversing direction unless of length 1
        if (direction !== "left" || snake.length === 1) {
          direction = "right";
        }
      break;

      case 40: // disallow reversing direction unless of length 1
        if (direction !== "up" || snake.length === 1) {
          direction = "down";
        }
      break;

      case 32:
        if (window.interval) {
          clearInterval(window.interval);
          window.interval = null;
          start_screen.innerText = "PAUSED | PRESS SPACE TO RESUME";
          start_screen.style.display = "block";
          setTimeout(function() {
              start_screen.style.opacity = "1";
          }, 50);

        } else {
          window.interval = setInterval(function() {
            drawEverything();
            moveEverything();
          }, 1000/framesPerSecond);

          // fade out start_screen
          start_screen.style.opacity = "0";

          // delay start_screen removal for fade out
          setTimeout(function() {
              start_screen.style.display = "none";
          }, 100);

        }

      break;

      default:
      return "some other key was pressed";
    }


  });

  mySwitch.addEventListener("click", function() {
    if (bounded === false) {
      bounded = true;

      setTimeout(function() {relay.innerText = "ON";}, 150);
      relay.style.transform = "translateX(60%) translateY(-50%)";

      mySwitch.style.transform = "translateX(150%)";
      mySwitch.style.boxShadow = "-1px 0px 0px 0 rgba(0,0,0,0.2)";
      mySwitch.style.borderRight = "0";
      mySwitch.style.borderLeft = "1px solid #444";

    } else {
      bounded = false;

      setTimeout(function() {relay.innerText = "OFF";}, 150);
      relay.style.transform = "translateX(155%) translateY(-50%)";

      mySwitch.style.transform = "translateX(0%)";
      mySwitch.style.boxShadow = "1px 0px 0px 0 rgba(0,0,0,0.2)";
      mySwitch.style.borderRight = "1px solid #444";
      mySwitch.style.borderLeft = "0";

    }
  });


};
