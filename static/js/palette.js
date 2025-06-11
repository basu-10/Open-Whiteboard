// static/js/palette.js

const colorPicker = document.getElementById('custom-color-picker');
const colorPickerContainer = document.querySelector('.color-picker');
let savedState = JSON.parse(localStorage.getItem('autosave'));
let customColors = (savedState && savedState.palette) || [];


window.addEventListener('load', () => {
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            // Visually mark active
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');

            const selectedColor = option.dataset.color;

            // Update the color for the active tool
            if (currentTool === 'marker' || currentTool === 'pencil') {
                toolColors[pencilMode ? 'pencil' : 'marker'] = selectedColor;
                updateBrushSettings();
            } else if (currentTool === 'text') {
                toolColors.text = selectedColor;
            }

            console.log("Updated toolColors:", toolColors);
        });
    });
});



// Handle new color picked
colorPicker.addEventListener('change', function () {
    const selectedColor = this.value;

    // If color already exists, just activate it
    let existing = colorPickerContainer.querySelector(`[data-color="${selectedColor}"]`);
    if (existing) {
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
        existing.classList.add('active');
    } else {
        // New custom color
        customColors.push(selectedColor);
        saveCustomColors();
        const newCircle = createColorCircle(selectedColor);

        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
        newCircle.classList.add('active');
    }

    if (currentTool === 'marker' || currentTool === 'pencil') {
        toolColors[pencilMode ? 'pencil' : 'marker'] = selectedColor;
        updateBrushSettings();
    } else if (currentTool === 'text') {
        toolColors.text = selectedColor;
    }

});

// Call on load
loadCustomColors();
//on page load:
window.addEventListener('load', () => {
    const saved = localStorage.getItem('autosave');
    if (saved) {
        if (confirm('Restore last session?')) {
            const data = JSON.parse(saved);
            canvas.setWidth(data.width);
            canvas.setHeight(data.height);
            customColors = data.palette;
            saveCustomColors();
            canvas.loadFromJSON(data.canvasData, canvas.renderAll.bind(canvas));
        }
    }
});


function clearCustomColors() {
    customColors = [];
    saveCustomColors();

    document.querySelectorAll('.custom-color').forEach(el => {
        if (!el.hasAttribute('data-default')) {
            el.remove();
        }
    });

    if (currentTool === 'marker' || currentTool === 'pencil') {
        toolColors[pencilMode ? 'pencil' : 'marker'] = selectedColor;
        updateBrushSettings();
    } else if (currentTool === 'text') {
        toolColors.text = selectedColor;
    }

}


// Load saved custom colors on startup
function loadCustomColors() {
    customColors.forEach(color => {
        if (!colorPickerContainer.querySelector(`[data-color="${color}"]`)) {
            createColorCircle(color);
        }
    });
}

// Create color circle (preset-like)
function createColorCircle(color) {
    const circle = document.createElement('div');
    circle.classList.add('color-option', 'custom-color');
    circle.style.backgroundColor = color;
    circle.dataset.color = color;

    circle.addEventListener('click', function () {
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
    this.classList.add('active');

    const selectedColor = this.dataset.color;

    if (currentTool === 'marker' || currentTool === 'pencil') {
        toolColors[pencilMode ? 'pencil' : 'marker'] = selectedColor;
        updateBrushSettings();
    } else if (currentTool === 'text') {
        toolColors.text = selectedColor;
    }

    console.log('Updated toolColors:', toolColors);
    });


    colorPickerContainer.appendChild(circle);
    return circle;
}

// Save to localStorage
function saveCustomColors() {

    //localStorage.setItem('customColors', JSON.stringify(customColors));

     const state = {
        canvasData: canvas.toJSON(),
        width: canvas.getWidth(),
        height: canvas.getHeight(),
        palette: customColors
    };
    localStorage.setItem('autosave', JSON.stringify(state));

}





    document.getElementById('save-palette-btn').addEventListener('click', function () {
    const palette = {
        colors: customColors // already have this array
    };

    const blob = new Blob([JSON.stringify(palette, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'palette.json';
    a.click();
});


document.getElementById('load-palette-btn').addEventListener('click', function () {
    document.getElementById('palette-input').click();
});

document.getElementById('palette-input').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (evt) {
        try {
            const json = JSON.parse(evt.target.result);

            if (Array.isArray(json.colors)) {
                // Combine old and new colors, remove duplicates
                const allColors = [...customColors, ...json.colors];
                const uniqueColors = [...new Set(allColors)];

                // Update global array
                customColors = uniqueColors;
                saveCustomColors(); // optional: save to localStorage

                // Remove all previous .custom-color elements
                document.querySelectorAll('.color-option.custom-color').forEach(el => el.remove());

                // Recreate all custom colors
                customColors.forEach(color => {
                    createColorCircle(color);
                });
            } else {
                alert("Invalid palette format.");
            }
        } catch (err) {
            alert("Failed to load palette.");
        }
    };
    reader.readAsText(file);

    // Reset the input so user can load the same file again if needed
    e.target.value = '';
});


function highlightCurrentToolColor() {
    // Get active tool and its color
    let toolColor = null;

    if (currentTool === 'marker' || currentTool === 'pencil') {
        toolColor = toolColors[pencilMode ? 'pencil' : 'marker'];
    } else if (currentTool === 'text') {
        toolColor = toolColors.text;
    } else {
        return; // No highlighting needed
    }

    // Remove old highlights
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));

    // Try to find a matching color circle
    const match = document.querySelector(`.color-option[data-color="${toolColor}"]`);

    if (match) {
        match.classList.add('active');
    } else {
        // fallback: select custom color picker
        colorPicker.value = toolColor;
    }
}

//at the bottom
window.highlightCurrentToolColor = highlightCurrentToolColor;
