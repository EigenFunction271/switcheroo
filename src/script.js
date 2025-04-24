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

function updateTheme(isNightMode) {
  // Update body class
  document.body.classList.toggle("night-mode", isNightMode);
  
  // Update greeting text
  greetingElement.textContent = isNightMode ? "Good Night!" : "Good Morning!";
  
  // Save state to localStorage
  localStorage.setItem("isNightMode", isNightMode);
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
