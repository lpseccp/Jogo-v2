const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const player = {
  x: 200,
  y: 300,
  size: 20,
  color: "white",
  speed: 2,
  dir: "right"
};

let showActionMessage = false;
let nearDoor = false;
let doorOpened = false;

const rooms = [
  { x: 50, y: 50, width: 400, height: 300, doorX: 220, doorY: 50 }
];

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.save();
  ctx.translate(player.x, player.y);

  if (player.dir === "left") ctx.scale(-1, 1);
  ctx.fillRect(-player.size / 2, -player.size / 2, player.size, player.size);

  ctx.restore();
}

function drawRoom(room) {
  ctx.strokeStyle = "gray";
  ctx.lineWidth = 4;
  ctx.strokeRect(room.x, room.y, room.width, room.height);

  if (!doorOpened) {
    ctx.fillStyle = "brown";
    ctx.fillRect(room.doorX, room.doorY, 40, 10);
  }
}

function drawText(msg, x, y) {
  ctx.fillStyle = "white";
  ctx.font = "16px sans-serif";
  ctx.fillText(msg, x, y);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Movimento
  player.x += joystickData.dx * player.speed;
  player.y += joystickData.dy * player.speed;

  // Direção
  if (joystickData.dx > 0.1) player.dir = "right";
  else if (joystickData.dx < -0.1) player.dir = "left";

  // Verifica colisão com a porta
  const room = rooms[0];
  nearDoor = false;
  if (!doorOpened) {
    const distX = Math.abs(player.x - (room.doorX + 20));
    const distY = Math.abs(player.y - (room.doorY + 5));
    if (distX < 30 && distY < 30) {
      showActionMessage = true;
      nearDoor = true;
    } else {
      showActionMessage = false;
    }
  }

  // Desenha sala e porta
  drawRoom(room);

  // Texto de ação
  if (showActionMessage && !doorOpened) {
    drawText("Aperte A para abrir", player.x - 60, player.y - 30);
  }

  drawPlayer();
}

function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();

// Interação com botão A
function handleActionButton() {
  if (nearDoor && !doorOpened) {
    doorOpened = true;
    showActionMessage = false;
  }
}
