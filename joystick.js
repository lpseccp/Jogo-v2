let joystick = document.getElementById("joystick");
let joystickContainer = document.getElementById("joystickContainer");

let joystickData = {
  dx: 0,
  dy: 0
};

let active = false;
let startX, startY;

joystickContainer.addEventListener("touchstart", function (e) {
  active = true;
  let touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
});

joystickContainer.addEventListener("touchmove", function (e) {
  if (!active) return;
  let touch = e.touches[0];
  let dx = touch.clientX - startX;
  let dy = touch.clientY - startY;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let maxDist = 40;

  if (dist > maxDist) {
    dx = (dx / dist) * maxDist;
    dy = (dy / dist) * maxDist;
  }

  joystick.style.transform = `translate(${dx}px, ${dy}px)`;
  joystickData.dx = dx / maxDist;
  joystickData.dy = dy / maxDist;
});

joystickContainer.addEventListener("touchend", function () {
  active = false;
  joystick.style.transform = `translate(0px, 0px)`;
  joystickData.dx = 0;
  joystickData.dy = 0;
});
