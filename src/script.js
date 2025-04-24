import confetti from 'canvas-confetti';

const toggleSwitchCheckbox = document.getElementById("toggle-switch-checkbox");
const greetingElement = document.getElementById("greeting");

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
