const joystick = document.getElementById("joystick");
const container = document.getElementById("joystickContainer");

let joystickData = {
  dx: 0,
  dy: 0
};

let dragging = false;

container.addEventListener("touchstart", (e) => {
  dragging = true;
});

container.addEventListener("touchend", () => {
  dragging = false;
  joystick.style.left = "30px";
  joystick.style.top = "30px";
  joystickData.dx = 0;
  joystickData.dy = 0;
});

container.addEventListener("touchmove", (e) => {
  if (!dragging) return;
  const touch = e.touches[0];
  const rect = container.getBoundingClientRect();
  const x = touch.clientX - rect.left - 50;
  const y = touch.clientY - rect.top - 50;
  const dist = Math.sqrt(x * x + y * y);
  const max = 40;
  const clampedX = Math.max(-max, Math.min(max, x));
  const clampedY = Math.max(-max, Math.min(max, y));

  joystick.style.left = 30 + clampedX + "px";
  joystick.style.top = 30 + clampedY + "px";

  joystickData.dx = clampedX / max;
  joystickData.dy = clampedY / max;
});
