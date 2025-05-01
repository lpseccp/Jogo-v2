let joystickData = { dx: 0, dy: 0 };

const joystickContainer = document.getElementById("joystickContainer");
const joystick = document.getElementById("joystick");

let dragging = false;

joystickContainer.addEventListener("touchstart", function (e) {
  dragging = true;
});

joystickContainer.addEventListener("touchend", function (e) {
  dragging = false;
  joystick.style.left = "20px";
  joystick.style.top = "20px";
  joystickData = { dx: 0, dy: 0 };
});

joystickContainer.addEventListener("touchmove", function (e) {
  if (!dragging) return;

  const rect = joystickContainer.getBoundingClientRect();
  const touch = e.touches[0];

  let x = touch.clientX - rect.left - rect.width / 2;
  let y = touch.clientY - rect.top - rect.height / 2;

  const maxDistance = rect.width / 2;
  const distance = Math.min(maxDistance, Math.hypot(x, y));

  const angle = Math.atan2(y, x);
  const dx = Math.cos(angle) * distance;
  const dy = Math.sin(angle) * distance;

  joystick.style.left = `${dx + maxDistance - joystick.offsetWidth / 2}px`;
  joystick.style.top = `${dy + maxDistance - joystick.offsetHeight / 2}px`;

  joystickData = {
    dx: Math.cos(angle),
    dy: Math.sin(angle)
  };
});
