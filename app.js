const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let player = {
  x: 180,
  y: 500,
  size: 20,
  speed: 2,
  angle: 0
};

const walls = [
  // paredes do corredor
  { x: 150, y: 0, w: 10, h: 600 }, // esquerda
  { x: 240, y: 0, w: 10, h: 600 }, // direita

  // sala esquerda
  { x: 60, y: 320, w: 100, h: 10 },
  { x: 60, y: 320, w: 10, h: 120 },
  { x: 60, y: 440, w: 100, h: 10 },

  // sala direita
  { x: 240, y: 200, w: 100, h: 10 },
  { x: 330, y: 200, w: 10, h: 120 },
  { x: 240, y: 320, w: 100, h: 10 }
];

// portas com colisores
let doors = [
  {
    x: 150, y: 360, w: 10, h: 40,
    open: false,
    message: false,
    colider: { x: 150, y: 360, w: 10, h: 40 }
  },
  {
    x: 240, y: 260, w: 10, h: 40,
    open: false,
    message: false,
    colider: { x: 240, y: 260, w: 10, h: 40 }
  }
];

let showMessage = "";

function drawWalls() {
  ctx.fillStyle = "#555";
  for (let wall of walls) {
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
  }
}

function drawDoors() {
  for (let door of doors) {
    ctx.fillStyle = door.open ? "#2ecc71" : "#aaa";
    ctx.fillRect(door.x, door.y, door.w, door.h);
  }
}

function drawPlayer() {
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();
}

function drawLanterna() {
  let angle = Math.atan2(joystickData.dy, joystickData.dx);
  if (joystickData.dx !== 0 || joystickData.dy !== 0) {
    player.angle = angle;
  }

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle);

  let gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, 150);
  gradient.addColorStop(0, "rgba(255,255,255,0.3)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(100, -50);
  ctx.lineTo(100, 50);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawMessage() {
  if (showMessage) {
    ctx.fillStyle = "white";
    ctx.font = "16px sans-serif";
    ctx.fillText(showMessage, 10, 30);
  }
}

function isColliding(x, y) {
  for (let wall of walls) {
    if (
      x + player.size > wall.x &&
      x - player.size < wall.x + wall.w &&
      y + player.size > wall.y &&
      y - player.size < wall.y + wall.h
    ) {
      return true;
    }
  }

  for (let door of doors) {
    if (!door.open && door.colider) {
      let d = door.colider;
      if (
        x + player.size > d.x &&
        x - player.size < d.x + d.w &&
        y + player.size > d.y &&
        y - player.size < d.y + d.h
      ) {
        return true;
      }
    }
  }

  return false;
}

function update() {
  let nextX = player.x + joystickData.dx * player.speed;
  let nextY = player.y + joystickData.dy * player.speed;

  if (!isColliding(nextX, player.y)) {
    player.x = nextX;
  }
  if (!isColliding(player.x, nextY)) {
    player.y = nextY;
  }

  showMessage = "";
  for (let door of doors) {
    let dist = Math.hypot(player.x - door.x, player.y - door.y);
    if (!door.open && dist < 50) {
      door.message = true;
      showMessage = "Aperte Ação para abrir a porta";
    } else {
      door.message = false;
    }
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "a" || e.key === "A") {
    for (let door of doors) {
      if (door.message && !door.open) {
        door.open = true;
        door.colider = null; // Remove o bloqueio
        // opcional: som aqui
      }
    }
  }
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWalls();
  drawDoors();
  drawLanterna();
  drawPlayer();
  drawMessage();
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();
