import confetti from 'canvas-confetti';

const toggleSwitchCheckbox = document.getElementById("toggle-switch-checkbox");
const greetingElement = document.getElementById("greeting");
const toggleWrapper = document.querySelector(".toggle-wrapper");

// Mouse avoidance variables
const DISTANCE_THRESHOLD = 400;
const MAX_MOVEMENT = 250;
const SPRING_STRENGTH = 0.12;
const DAMPING = 0.85;
const ROTATION_STRENGTH = 0.1;
const MAX_ROTATION = 15; // Maximum rotation in degrees
let isAnimating = false;
let mouseX = 0;
let mouseY = 0;
let switchCenterX = 0;
let switchCenterY = 0;
let velocityX = 0;
let velocityY = 0;
let rotationVelocity = 0;
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let currentRotation = 0;
let animationFrame = null;
let lastMouseSpeed = { x: 0, y: 0 };
let lastMousePos = { x: 0, y: 0 };

// Sound effects setup
const swooshSound = new Audio('data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YRAAAAAA/////wAAAP//AAD//wAAAA==');
swooshSound.volume = 0.2;

const popSound = new Audio('data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YRAAAAAA/////wAAAP//AAD//wAAAA==');
popSound.volume = 0.3;

let lastSoundTime = 0;

// Sparkle effect setup
const sparkleColors = {
  day: ['#facc15', '#fde047', '#fff'],
  night: ['#94a3b8', '#cbd5e1', '#e2e8f0']
};

function createSparkle(x, y, isClick = false) {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  
  // Random size for variety
  const size = isClick ? Math.random() * 8 + 4 : Math.random() * 4 + 2;
  sparkle.style.width = `${size}px`;
  sparkle.style.height = `${size}px`;
  
  // Random rotation
  sparkle.style.transform = `rotate(${Math.random() * 360}deg)`;
  
  // Random color from current theme
  const colors = document.body.classList.contains('night-mode') ? sparkleColors.night : sparkleColors.day;
  sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  
  document.body.appendChild(sparkle);
  
  // Animate sparkle
  sparkle.animate([
    { transform: 'scale(1) rotate(0deg)', opacity: 1 },
    { transform: 'scale(0) rotate(360deg)', opacity: 0 }
  ], {
    duration: isClick ? 1000 : 500,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }).onfinish = () => sparkle.remove();
}

// Track cursor movement
let lastSparkleTime = 0;
document.addEventListener('mousemove', (e) => {
  const currentTime = Date.now();
  if (currentTime - lastSparkleTime > 50) { // Limit sparkle frequency
    createSparkle(e.clientX, e.clientY);
    lastSparkleTime = currentTime;
  }
});

// Add sparkles on click
document.addEventListener('click', (e) => {
  // Create multiple sparkles for click effect
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const distance = 20;
    const x = e.clientX + Math.cos(angle) * distance;
    const y = e.clientY + Math.sin(angle) * distance;
    createSparkle(x, y, true);
  }
});

function applySpringPhysics() {
  if (!isAnimating) {
    // Calculate spring force
    const forceX = (targetX - currentX) * SPRING_STRENGTH;
    const forceY = (targetY - currentY) * SPRING_STRENGTH;

    // Apply force to velocity
    velocityX += forceX;
    velocityY += forceY;

    // Calculate rotation based on movement
    const targetRotation = (velocityX * 0.5) * MAX_ROTATION;
    const rotationForce = (targetRotation - currentRotation) * ROTATION_STRENGTH;
    rotationVelocity += rotationForce;
    rotationVelocity *= DAMPING;
    currentRotation += rotationVelocity;
    
    // Clamp rotation
    currentRotation = Math.max(Math.min(currentRotation, MAX_ROTATION), -MAX_ROTATION);

    // Apply damping
    velocityX *= DAMPING;
    velocityY *= DAMPING;

    // Update position
    currentX += velocityX;
    currentY += velocityY;

    // Apply movement and rotation
    toggleWrapper.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentRotation}deg)`;

    // Continue animation if there's still significant movement
    if (Math.abs(velocityX) > 0.01 || Math.abs(velocityY) > 0.01 || 
        Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01 ||
        Math.abs(rotationVelocity) > 0.01) {
      animationFrame = requestAnimationFrame(applySpringPhysics);
    } else {
      cancelAnimationFrame(animationFrame);
      if (targetX === 0 && targetY === 0) {
        currentX = 0;
        currentY = 0;
        currentRotation = 0;
        toggleWrapper.style.transform = 'translate(0, 0) rotate(0deg)';
      }
    }
  }
}

function updateSwitchPosition(e) {
  if (isAnimating) return;

  // Calculate mouse speed
  const mouseSpeed = {
    x: e.clientX - lastMousePos.x,
    y: e.clientY - lastMousePos.y
  };
  
  // Play swoosh sound if moving fast enough and not too frequent
  const currentTime = Date.now();
  const speed = Math.sqrt(mouseSpeed.x * mouseSpeed.x + mouseSpeed.y * mouseSpeed.y);
  if (speed > 30 && currentTime - lastSoundTime > 150) {
    swooshSound.currentTime = 0;
    swooshSound.play();
    lastSoundTime = currentTime;
  }

  lastMousePos = { x: e.clientX, y: e.clientY };
  lastMouseSpeed = mouseSpeed;

  mouseX = e.clientX;
  mouseY = e.clientY;

  const switchRect = toggleWrapper.getBoundingClientRect();
  switchCenterX = switchRect.left + switchRect.width / 2;
  switchCenterY = switchRect.top + switchRect.height / 2;

  const deltaX = mouseX - switchCenterX;
  const deltaY = mouseY - switchCenterY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  if (distance < DISTANCE_THRESHOLD) {
    const movement = (1 - distance / DISTANCE_THRESHOLD) * MAX_MOVEMENT;
    const angle = Math.atan2(deltaY, deltaX);
    
    // Add some variation based on mouse speed
    const speedFactor = Math.min(Math.abs(mouseSpeed.x) + Math.abs(mouseSpeed.y), 50) / 50;
    const extraMovement = speedFactor * 20; // Extra movement when mouse is moving fast

    targetX = -Math.cos(angle) * (movement + extraMovement);
    targetY = -Math.sin(angle) * (movement + extraMovement);
  } else {
    targetX = 0;
    targetY = 0;
  }

  if (!animationFrame) {
    animationFrame = requestAnimationFrame(applySpringPhysics);
  }
}

function resetSwitchPosition() {
  targetX = 0;
  targetY = 0;
  if (!animationFrame) {
    animationFrame = requestAnimationFrame(applySpringPhysics);
  }
}

// Add mouse tracking
document.addEventListener('mousemove', updateSwitchPosition);
document.addEventListener('mouseleave', resetSwitchPosition);

/**
 * Sets the visual state of the checkbox and saves the state to localStorage.
 * @param {'on' | 'off'} state - The desired state ('on' for checked, 'off' for unchecked).
 */
function setSwitchState(state) {
  const isChecked = state === "on";
  // Update localStorage
  localStorage.setItem("switchState", state);

  // Update the checkbox's checked property visually
  if (toggleSwitchCheckbox) {
    toggleSwitchCheckbox.checked = isChecked;
  }
  // Add console log for debugging/demonstration if needed
  // console.log(`Switch state set to: ${state}`);
}

function createConfetti(isNight) {
  const colors = isNight ? ['#94a3b8', '#cbd5e1', '#e2e8f0'] : ['#facc15', '#fde047', '#fff'];
  
  const count = 100;
  const defaults = {
    origin: { y: 0.7 },
    spread: 50,
    ticks: 100,
    gravity: 0.8,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['star'],
    colors: colors,
    scalar: 2
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

function updateTheme(isNightMode) {
  isAnimating = true;
  cancelAnimationFrame(animationFrame);
  animationFrame = null;
  
  // Reset spring physics values
  velocityX = 0;
  velocityY = 0;
  currentX = 0;
  currentY = 0;
  targetX = 0;
  targetY = 0;
  
  toggleWrapper.style.transform = 'translate(0, 0)';

  // Update body class
  document.body.classList.toggle("night-mode", isNightMode);
  
  // Update greeting text with fade effect
  greetingElement.style.opacity = "0";
  setTimeout(() => {
    greetingElement.textContent = isNightMode ? "Good Night!" : "Good Morning!";
    greetingElement.style.opacity = "1";
  }, 500);
  
  // Save state to localStorage
  localStorage.setItem("isNightMode", isNightMode);

  // Trigger confetti
  createConfetti(isNightMode);

  // Play pop sound on toggle
  popSound.currentTime = 0;
  popSound.play();

  // Re-enable movement after animation
  setTimeout(() => {
    isAnimating = false;
  }, 1000);
}

// --- Initialization ---

// Retrieve the last known state from localStorage
const savedState = localStorage.getItem("switchState");

// Determine the initial state: use saved state or default to 'off'
const initialState = savedState ? savedState : "off";

// Apply the initial state when the page loads
setSwitchState(initialState);

// Initialize theme from localStorage
const savedIsNightMode = localStorage.getItem("isNightMode") === "true";
toggleSwitchCheckbox.checked = savedIsNightMode;
updateTheme(savedIsNightMode);

// --- Event Listener ---

// Add a listener to the checkbox to update state when it's toggled by the user
if (toggleSwitchCheckbox) {
  toggleSwitchCheckbox.addEventListener("change", (e) => {
    const newState = e.target.checked ? "on" : "off";
    setSwitchState(newState);
    updateTheme(e.target.checked);
  });
} else {
  console.error("Toggle switch checkbox element not found!");
}

// --- How to Use This Boilerplate ---
// To react to the switch state changes elsewhere in your application,
// you can either:
// 1. Check localStorage directly: `localStorage.getItem("switchState")`
// 2. Add more event listeners to the `toggleSwitchCheckbox`'s 'change' event.
// 3. Dispatch a custom event from the `setSwitchState` function that other parts
//    of your application can listen for.
// Example of dispatching a custom event (add inside setSwitchState):
// const event = new CustomEvent('switchStateChange', { detail: { newState: state } });
// document.dispatchEvent(event);
// // Then listen elsewhere: document.addEventListener('switchStateChange', (e) => { console.log(e.detail.newState); });

// Custom cursor setup
const customCursor = document.querySelector('.custom-cursor');
let cursorX = 0;
let cursorY = 0;
let cursorTargetX = 0;
let cursorTargetY = 0;

function updateCursorPosition(e) {
  cursorTargetX = e.clientX;
  cursorTargetY = e.clientY;
}

function animateCursor() {
  // Smooth cursor movement
  cursorX += (cursorTargetX - cursorX) * 0.1;
  cursorY += (cursorTargetY - cursorY) * 0.1;
  
  customCursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-8px, -8px)`;
  
  requestAnimationFrame(animateCursor);
}

// Start cursor animation
animateCursor();

// Update cursor position on mouse move
document.addEventListener('mousemove', updateCursorPosition);
