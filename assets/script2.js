const targetColor = "red";
const paddleColor = "blue";//pushka
const projectileColor = "rgb(0, 255, 213)";

const btnRestart = document.querySelector('.restart');

const canvas = document.getElementById("mon_canvas");
const ctx = canvas.getContext("2d");
const paddleSize = 40;
let posY = canvas.height - 10;
let posX = canvas.width / 2;

let lifeCompt = 3;
let score = 0;

const projectiles = [];
const cibles = [];

let gamePaused = false;

//paddle
class Paddle {
  constructor(posX) {
    this.x = posX;
    this.y = posY;
    this.color = paddleColor;
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    // ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.arc(this.x, canvas.height - 10, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    // ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.moveTo(this.x - 20, this.y - 3);
    ctx.lineTo(this.x - 10, this.y - 43);
    ctx.lineTo(this.x + 10, this.y - 43);
    ctx.lineTo(this.x + 20, this.y - 3);
    ctx.strokeStyle = 'orange';
    ctx.lineJoin = 'bevel';
    ctx.stroke();
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }
}
//projectile
class Projectile {
  constructor(posX, velocity) {
    this.x = posX;
    this.y = posY - paddleSize;
    this.radius = 2;
    this.v = velocity;
    this.color = projectileColor;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.draw();
    this.y = this.y - this.v;
  }
}
//cible
class Target {
  constructor(posX, posY, velocity, radius) {
    this.x = posX;
    this.y = posY;
    this.radius = radius;
    this.v = velocity;
    this.color = targetColor;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.draw();
    this.y = this.y + this.v;
  }
}

//animation du jeu
let animation;


function animate() {
  animation = requestAnimationFrame(animate);
  
//position du canon middle
  const paddle = new Paddle(posX);
  paddle.draw();

  projectiles.forEach((projectile, index) => {
    projectile.update();

    //enlever le projectile une fois hors de l'écran
    if (projectile.y + projectile.radius < 0) {
      setTimeout(() => {
        projectiles.splice(index, 0);
      }, 0);
    }
  });
//systeme de vie
  cibles.forEach((cible, index) => {
    cible.update();

    const dist = canvas.height - cible.y;

    if (dist - cible.radius < 1) {
      lifeCompt = lifeCompt - 1;
      document.getElementById("lifeCompteur").innerHTML =  lifeCompt;
      
      setTimeout(() => {
        cibles.splice(index, 1);
      }, 0);

      if (lifeCompt === 0) {
        document.getElementById("lifeCompteur").innerHTML = lifeCompt;
        cancelAnimationFrame(animation);
      }
    }

    // detection de collision entre les projectiles et les targets

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - cible.x, projectile.y - cible.y);

      if (dist - cible.radius - projectile.radius < 1) {
        score = score + 1;
        document.getElementById('scoreGame').innerHTML = score;
        setTimeout(() => {
          cibles.splice(index, 1);
          projectiles.splice(projectileIndex, 1);
        }, 0);
        
      }
    });
  });
}
//Spawn des cibles
function spawnCibles() {
  setInterval(() => {
    const radius = Math.random() * (25 - 5) + 5;
    const posX = CiblesPositionSpwan(radius);
    const posY = 0 - radius;
    const velocity = 1;
    cibles.push(new Target(posX, posY, velocity, radius));
  }, 2500);
}

function CiblesPositionSpwan(radius) {
  let r = radius;
  let spawnPos = Math.random() * canvas.width;

  return spawnPos < 0 || spawnPos < r
    ? (spawnPos = r)
    : spawnPos > canvas.width - r
    ? (spawnPos = canvas.width - r)
    : spawnPos;
}

addEventListener("keydown", (e) => {
  if (e.key == "ArrowLeft" && posX >= paddleSize / 2) {
    posX -= 12;
  } else if (e.key == "ArrowRight" && posX <= canvas.width - paddleSize / 2) {
    posX += 12;
  }
  if (e.code == "Space") {
    projectiles.push(new Projectile(posX, 5));
  }
});

btnRestart.addEventListener('click', () =>  location.reload());

animate();
spawnCibles();
