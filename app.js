const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let player = {
  x: 180,
  y: 500,
  size: 20,
  speed: 2,
  angle: 0
};

let showHint = false;

let doors = [
  {
    x: 150,
    y: 370,
    w: 10,
    h: 40,
    open: false,
    side: "left"
  },
  {
    x: 240,
    y: 270,
    w: 10,
    h: 40,
    open: false,
    side: "right"
  }
];

const walls = [
  // corredor
  { x: 150, y: 0, w: 10, h: 600 },
  { x: 240, y: 0, w: 10, h: 600 },

  // sala esquerda (maior)
  { x: 60, y: 300, w: 90, h: 10 },
  { x: 60, y: 300, w: 10, h: 200 },
  { x: 60, y: 500, w: 90, h: 10 },

  // sala direita (maior)
  { x: 240, y: 200, w: 90, h: 10 },
  { x: 320, y: 200, w: 10, h: 200 },
  { x: 240, y: 400, w: 90, h: 10 }
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
    if (!door.open) {
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

function drawHintText() {
  if (showHint) {
    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    ctx.fillText("Aperte AÇÃO para abrir", canvas.width / 2 - 90, 50);
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
    if (!door.open) {
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

  if (!isColliding(nextX, player.y)) {
    player.x = nextX;
  }
  if (!isColliding(player.x, nextY)) {
    player.y = nextY;
  }

  showHint = false;
  for (let door of doors) {
    if (!door.open) {
      let dx = player.x - (door.x + door.w / 2);
      let dy = player.y - (door.y + door.h / 2);
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 40) {
        showHint = true;
        door.near = true;
      } else {
        door.near = false;
      }
    }
  }
}

function handleAction() {
  for (let door of doors) {
    if (door.near && !door.open) {
      door.open = true;
    }
  }
}

const actionButton = document.getElementById("actionBtn");
if (actionButton) {
  actionButton.addEventListener("click", handleAction);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawWalls();
  drawDoors();
  drawLanterna();
  drawPlayer();
  drawHintText();
  update();

  requestAnimationFrame(gameLoop);
}

gameLoop();
