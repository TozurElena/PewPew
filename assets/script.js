let canvas = document.getElementById('mon_canvas');
let ctx = canvas.getContext("2d");

let x = canvas.width/2;
let y = canvas.height-10;
let dx = 2;
let dy = -2;
let ballRadius = 10;
let xBall = 0;
let yBall = 0;

let paddleHeight = 40;
let paddleWidth = 40;
let paddleX = (canvas.width-paddleWidth)/2;
let paddleY = canvas.height-paddleHeight;
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;
let brickRowCount = 5;
let brickColumnCount = 9;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
let score = 0;
let lives = 3;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keydown", keyDownBall, false);
document.addEventListener("keyup", keyUpHandler, false);
// document.addEventListener("mousemove", mouseMoveHandler, false);

// function mouseMoveHandler(e) {
//     let relativeX = e.clientX - canvas.offsetLeft;
//     // console.log(relativeX);
//     if(relativeX > 0 && relativeX < canvas.width) {
//         paddleX = relativeX - paddleWidth/2;
//     }
// }

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
        
}

function keyDownBall(e) {
    if(e.keyCode == 32) {
        // spacePressed = true;
        xBall = e.clientX;
        // let y = e.clientY - canvas.offsetHeight;
        console.log(xBall);
        // console.log(y);
        // drawBall();
    }
  
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
    else if(e.keyCode == 32) {
        spacePressed = true;
    }
}

function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
            // calculations
//    Координата X шара больше, чем координата X кирпича.
// Координата X шара меньше, чем  X-координата кирпича плюс его ширина.
// Координата Y шара больше, чем Y-координата кирпича.
// Координата Y шара меньше, чем Y-координата кирпича плюс его высота.
              if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                dy = -dy;
                b.status = 0;
                score++;
                if (score == brickColumnCount * brickRowCount) {
                  alert ('Victoire!');
                  document.location.reload();
                }
              }
            }
        }
    }
}
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
// function drawBallSpace() {
//     ctx.beginPath();
//     ctx.arc(x, y, ballRadius, 0, Math.PI*2);
//     ctx.fillStyle = "#0095DD";
//     ctx.fill();
//     ctx.closePath();
// }
function drawPaddle() {
    ctx.beginPath();
    // ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.arc(paddleX, canvas.height-paddleHeight, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    // ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.moveTo(paddleX - 20, paddleY - 3);
    ctx.lineTo(paddleX - 10, paddleY - 43);
    ctx.lineTo(paddleX + 10, paddleY - 43);
    ctx.lineTo(paddleX + 20, paddleY - 3);
    ctx.strokeStyle = 'orange';
    ctx.lineJoin = 'bevel';
    ctx.stroke();
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() { //столбцы (c); кирпичные ряды (r)
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
          if (bricks[c][r].status == 1) {
            let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
            let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
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

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
          if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
          }
          else {
            lives--;
            if (!lives) {
              alert("GAME OVER");
              document.location.reload();
              // clearInterval(interval); // Needed for Chrome to end game
            }
            else {
              x = canvas.width/2;
              y = canvas.height - 10;
              dx = 2;
              dy = -2;
              paddleX = (canvas.width - paddleWidth) / 2;
            }
          
          }
    }
    drawPaddle();
    if (rightPressed && paddleX < canvas.width-paddleWidth) {
      paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    drawScore();
    drawLives();
    collisionDetection();

    x += dx;
    y += dy;
  requestAnimationFrame(draw);
  // Функция draw() теперь выполняется снова и снова в цикле requestAnimationFrame(), но вместо фиксированной частоты кадров в 10 миллисекунд, мы возвращаем управление частотой кадров обратно в браузер. Соответственно он будет синхронизировать частоту кадров и отображать фигуры только при необходимости. 
  // Это обеспечивает более эффективный и плавный цикл анимации, чем более старый метод setInterval().
}


let interval = draw();
// let interval = setInterval(draw, 10);