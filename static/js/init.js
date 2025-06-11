// static/js/init.js
// Initialize canvas
const canvas = new fabric.Canvas('canvas', {
    isDrawingMode: false,
    selection: true,
    backgroundColor: '#ffffff'
});

// Set initial canvas dimensions
const initialWidth = 1200;
const initialHeight = 600;
canvas.setWidth(initialWidth);
canvas.setHeight(initialHeight);

// Initialize variables
let currentColor = '#000000';
let currentBrushSize = 5;
let canvasHistory = [];
let historyPointer = -1;
let currentTool = 'select';

// Update UI elements
document.getElementById('current-tool').textContent = 'Select';
document.getElementById('brush-size-value').textContent = currentBrushSize + 'px';
document.getElementById('canvas-size').textContent = `${initialWidth}x${initialHeight}`;

// Save initial state
saveState();

// Brush size
document.getElementById('brush-size').addEventListener('input', (e) => {
    currentBrushSize = parseInt(e.target.value);
    document.getElementById('brush-size-value').textContent = currentBrushSize + 'px';
    updateBrushSettings();
});



// Color selection
window.addEventListener('load', () => {
    // Custom color picker
    document.getElementById('custom-color-picker').addEventListener('input', function () {
        // Deselect all preset colors
        document.querySelectorAll('.color-option').forEach(opt => {
            opt.classList.remove('active');
        });
        
        // Update current color
        currentColor = this.value;
        updateBrushSettings();
    });
});


// At the end of init.js
window.canvas = canvas;
window.initialWidth = initialWidth;
window.initialHeight = initialHeight;
window.currentColor = currentColor;
window.currentBrushSize = currentBrushSize;
window.updateBrushSettings = updateBrushSettings;
window.saveState = saveState; // Also needed elsewhere
