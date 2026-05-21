// State variables
const state = {
    a: 1,
    b: 2
};

// DOM Elements
const valA = document.getElementById('valA');
const valB = document.getElementById('valB');
const valSum = document.getElementById('valSum');
const groupA = document.getElementById('groupA');
const groupB = document.getElementById('groupB');
const sliderA = document.getElementById('sliderA');
const sliderB = document.getElementById('sliderB');

// Function to render the visual dots
function renderDots(container, count, typeClass) {
    container.innerHTML = ''; // Clear current dots
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = `dot ${typeClass}`;
        container.appendChild(dot);
    }
}

// Main update function
function updateUI() {
    // Update Equation Text
    valA.textContent = state.a;
    valB.textContent = state.b;
    valSum.textContent = state.a + state.b;

    // Update Visual Dots
    renderDots(groupA, state.a, 'a');
    renderDots(groupB, state.b, 'b');
}

// Event Listeners for Sliders
sliderA.addEventListener('input', (e) => {
    state.a = parseInt(e.target.value);
    updateUI();
});

sliderB.addEventListener('input', (e) => {
    state.b = parseInt(e.target.value);
    updateUI();
});

updateUI();

const authOverlay = document.getElementById('auth-overlay');
authOverlay.style.display = 'flex'; // Lock app initially

window.addEventListener('message', (event) => {
    // Replace '*' with your actual domain in production for security
    if (event.data && event.data.type === 'AUTH_SUCCESS') {
        authOverlay.style.display = 'none'; // Unlock app
        console.log("H5 Module Authorized.");
    }
});
