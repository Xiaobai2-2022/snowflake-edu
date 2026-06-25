// State variables
const state = {
    a: 1,
    b: 2
};

// DOM Elements
const valA = document.getElementById('valA');
const valB = document.getElementById('valB');
const valProduct = document.getElementById('valProduct');
const dotGrid = document.getElementById('dotGrid');
const sliderA = document.getElementById('sliderA');
const sliderB = document.getElementById('sliderB');

// Main update function
function updateUI() {
    // Update Equation Text
    valA.textContent = state.a;
    valB.textContent = state.b;
    valProduct.textContent = state.a * state.b;

    // Update Visual Grid
    dotGrid.innerHTML = ''; // Clear current dots

    // Set grid dimensions dynamically
    dotGrid.style.gridTemplateColumns = `repeat(${state.b}, 20px)`;
    dotGrid.style.gridTemplateRows = `repeat(${state.a}, 20px)`;

    // Calculate total dots and render
    const totalDots = state.a * state.b;
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot product-dot';
        dotGrid.appendChild(dot);
    }
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

// Initial Render
updateUI();

// Auth Logic
const authOverlay = document.getElementById('auth-overlay');
authOverlay.style.display = 'flex'; // Lock app initially

window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'AUTH_SUCCESS') {
        authOverlay.style.display = 'none'; // Unlock app
        console.log("H5 Module Authorized.");
    }
});
