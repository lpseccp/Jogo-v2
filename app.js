const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let player = {
  x: 180,
  y: 500,
  size: 20,
  speed: 2,
  angle: 0
};

let walls = [
  // Corredor principal
  { x: 140, y: 0, w: 10, h: 600 },
  { x: 250, y: 0, w: 10, h: 600 },

  // Sala esquerda
  { x: 30, y: 320, w: 110, h: 10 },
  { x: 30, y: 320, w: 10, h: 110 },
  { x: 30, y: 430, w: 110, h: 10 },

  // Sala direita
  { x: 260, y: 220, w: 110, h: 10 },
  { x: 370, y: 220, w: 10, h: 110 },
  { x: 260, y: 330, w: 110, h: 10 }
];

let doors = [
  { x: 140, y: 360, w: 10, h: 50, opened: false }, // esquerda
  { x: 250, y: 260, w: 10, h: 50, opened: false }  // direita
];

function drawWalls() {
  ctx.fillStyle = "#555";
  for (let wall of walls) {
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
  }
}

function drawDoors() {
  ctx.fillStyle = "#aaa";
  for (let door of doors) {
    if (!door.opened) {
      ctx.fillRect(door.x, door.y, door.w, door.h);
    }
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
    if (!door.opened) {
      if (
        x + player.size > door.x &&
        x - player.size < door.x + door.w &&
        y + player.size > door.y &&
        y - player.size < door.y + door.h
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

  if (!isColliding(nextX, player.y)) player.x = nextX;
  if (!isColliding(player.x, nextY)) player.y = nextY;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawWalls();
  drawDoors();
  drawLanterna();
  drawPlayer();
  update();

  requestAnimationFrame(gameLoop);
}

function showMessage(text) {
  const msg = document.getElementById("message");
  msg.textContent = text;
  msg.style.display = "block";
  setTimeout(() => {
    msg.style.display = "none";
  }, 2000);
}

document.getElementById("actionButton").addEventListener("click", () => {
  for (let i = 0; i < doors.length; i++) {
    const door = doors[i];
    const dx = Math.abs(player.x - (door.x + door.w / 2));
    const dy = Math.abs(player.y - (door.y + door.h / 2));
    if (dx < 40 && dy < 40 && !door.opened) {
      door.opened = true;
      showMessage("Porta aberta!");
      break;
    }
  }
});

gameLoop();
