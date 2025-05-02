let joystickData = { dx: 0, dy: 0 };

const joystickContainer = document.getElementById("joystickContainer");
const joystick = document.getElementById("joystick");

let dragging = false;

// Centraliza o botão do joystick
const centerJoystick = () => {
  const containerRect = joystickContainer.getBoundingClientRect();
  joystick.style.left = `${(containerRect.width - joystick.offsetWidth) / 2}px`;
  joystick.style.top = `${(containerRect.height - joystick.offsetHeight) / 2}px`;
};

centerJoystick();

joystickContainer.addEventListener("touchstart", function (e) {
  e.preventDefault();
  dragging = true;
}, { passive: false });

joystickContainer.addEventListener("touchend", function (e) {
  e.preventDefault();
  dragging = false;
  centerJoystick();
  joystickData = { dx: 0, dy: 0 };
}, { passive: false });

joystickContainer.addEventListener("touchmove", function (e) {
  if (!dragging) return;

  e.preventDefault();

  const rect = joystickContainer.getBoundingClientRect();
  const touch = e.touches[0];

  let x = touch.clientX - rect.left - rect.width / 2;
  let y = touch.clientY - rect.top - rect.height / 2;

  const maxDistance = rect.width / 2 - joystick.offsetWidth / 2;
  const distance = Math.min(maxDistance, Math.hypot(x, y));

  const angle = Math.atan2(y, x);
  const dx = Math.cos(angle) * distance;
  const dy = Math.sin(angle) * distance;

  joystick.style.left = `${dx + rect.width / 2 - joystick.offsetWidth / 2}px`;
  joystick.style.top = `${dy + rect.height / 2 - joystick.offsetHeight / 2}px`;

  joystickData = {
    dx: dx / maxDistance,
    dy: dy / maxDistance
  };
}, { passive: false });
