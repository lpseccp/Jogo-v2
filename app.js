const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let player = {
  x: 180,
  y: 500,
  size: 20,
  speed: 2,
  angle: 0
};

// paredes fixas
const walls = [
  // corredor
  { x: 100, y: 0, w: 10, h: 600 }, // esquerda
  { x: 290, y: 0, w: 10, h: 600 }, // direita

  // sala esquerda (aumentada)
  { x: 10, y: 270, w: 100, h: 10 },
  { x: 10, y: 270, w: 10, h: 150 },
  { x: 10, y: 420, w: 100, h: 10 },

  // sala direita (aumentada)
  { x: 290, y: 170, w: 100, h: 10 },
  { x: 380, y: 170, w: 10, h: 150 },
  { x: 290, y: 320, w: 100, h: 10 }
];

// portas
let doors = [
  {
    x: 100, y: 320, w: 10, h: 60,
    open: false,
    showMessage: false
  },
  {
    x: 290, y: 230, w: 10, h: 60,
    open: false,
    showMessage: false
  }
];

let showMessage = "";

function drawWalls() {
  ctx.fillStyle = "#444";
  for (let wall of walls) {
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
  }
}

function drawDoors() {
  for (let door of doors) {
    if (!door.open) {
      ctx.fillStyle = "#888";
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
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle);

  let grad = ctx.createRadialGradient(0, 0, 10, 0, 0, 150);
  grad.addColorStop(0, "rgba(255,255,255,0.3)");
  grad.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(120, -50);
  ctx.lineTo(120, 50);
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

  // calcular proximidade com as portas
  showMessage = "";
  for (let door of doors) {
    const dist = Math.hypot(player.x - (door.x + door.w / 2), player.y - (door.y + door.h / 2));
    if (!door.open && dist < 50) {
      door.showMessage = true;
      showMessage = "Aperte Ação para abrir a porta";
    } else {
      door.showMessage = false;
    }
  }
}

// botão de ação (abre portas)
document.addEventListener("keydown", (e) => {
  if (e.key === "a" || e.key === "A") {
    for (let door of doors) {
      if (door.showMessage && !door.open) {
        door.open = true;
        // som opcional: new Audio('porta.mp3').play();
      }
    }
  }
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  drawWalls();
  drawDoors();
  drawLanterna();
  drawPlayer();
  drawMessage();
  requestAnimationFrame(gameLoop);
}

gameLoop();
