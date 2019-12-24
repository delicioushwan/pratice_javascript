const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d")
const container = document.getElementById('container')

let x = canvas.width / 2;
let y = canvas.height - 30;
const ballRadius = 10;
let dx = 2;
let dy = -2;
let speed = 1;
let isPaused = false;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let bricks = [];
let max = 5
for(let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1, item: Math.floor(Math.random() * Math.floor(max)) };
    }
}

let score = 0;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  if(!isPaused) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();
    drawSpeed();
    bounceBallOnPaddle();
    drawBricks();
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
  
    if(y + dy < ballRadius) {
      dy = -dy;
    } else if(y + dy > canvas.height - ballRadius) {
      openModal()
      clearInterval(interval); 
    }
  
    if(rightPressed) {
      paddleX += 7;
      if (paddleX + paddleWidth > canvas.width){
          paddleX = canvas.width - paddleWidth;
      }
    }
    else if(leftPressed) {
        paddleX -= 7;
        if (paddleX < 0){
            paddleX = 0;
        }
    }
    x += dx * speed;
    y += dy * speed;  
  }
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function keyDownHandler(e) {
  if(e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
  }
  else if(e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
  }
}

function keyUpHandler(e) {
  if(e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = false;
  }
  else if(e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft - container.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth/2;
  }
}

function drawBricks() {
  for(let c = 0; c < brickColumnCount; c++) {
    for(let r = 0; r < brickRowCount; r++) {
      if(bricks[c][r].status === 1) {
        let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for(let c = 0; c < brickColumnCount; c++) {
    for(let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if(b.status === 1) {
        if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if(score === brickRowCount*brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            openModal()
            clearInterval(interval);
          }

          if(b.item === 1) {
            speed += 0.5;
            isPaused = true;
            speedUp();
            setTimeout(() => isPaused = false, 2000);
          }
        }
      }
    }
  }
}

function bounceBallOnPaddle() {
  if(x + ballRadius > paddleX && x - ballRadius < paddleX + paddleWidth && y === canvas.height - (paddleHeight + ballRadius)) {
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -2
    } else {
      dy = -1
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "blue";
  ctx.fillText("Score: "+score, 8, 20);
}

function drawSpeed() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Speed: "+speed, 150, 20);
}

function speedUp() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("SPEED UP!!", canvas.width / 2 - 20, canvas.height / 2);
}

function openModal() {
  const modal = document.getElementsByClassName('modal')[0]
  modal.className = 'open'
}
let interval = setInterval(draw, 10)

function reset() {
  document.location.reload();
}
