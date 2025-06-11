// static/js/main.js


let toolColors = {
    marker: '#000000',
    pencil: '#000000',
    text: '#000000'
};


// on Tool selection by user
document.getElementById('select-tool').addEventListener('click', () => {
    setActiveTool('select');
    canvas.isDrawingMode = false;
    canvas.selection = true;
});

document.getElementById('marker-tool').addEventListener('click', () => {
    setActiveTool('marker');
    canvas.isDrawingMode = true;
    canvas.selection = false;
    updateBrushSettings();
});

document.getElementById('text-tool').addEventListener('click', () => {
    setActiveTool('text');
    canvas.isDrawingMode = false;
    canvas.selection = false;
    
    const text = new fabric.IText('Double Click to Type here...', {
        left: 100,
        top: 100,
        fontFamily: 'Verdana',
        fontSize: 24,
        fill: toolColors.text,
        padding: 10,
        hasControls: true
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    saveState();
});

document.getElementById('image-tool').addEventListener('click', () => {
    setActiveTool('image');
    canvas.isDrawingMode = false;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append('image', file);
        
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Server error: ${response.status} ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            
            fabric.Image.fromURL(data.url, img => {
                img.scaleToWidth(200);
                img.set({
                    left: 200,
                    top: 200,
                    selectable: true,
                    hasControls: true
                });
                canvas.add(img);
                canvas.setActiveObject(img);
                saveState();
            }, {
                crossOrigin: 'anonymous'
            });
        })
        .catch(error => {
            console.error('Error uploading image:', error);
            alert(`Failed to upload image: ${error.message}`);
        });
    };
    input.click();
});
        
        

///////////////   
        
// Functions
function setActiveTool(tool) {
    currentTool = tool;
    
    // Update UI buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (tool === 'select') {
    document.getElementById('select-tool').classList.add('active');
    document.getElementById('current-tool').textContent = 'Select';

    canvas.isDrawingMode = false;
    canvas.selection = true;
    } 
    else if (tool === 'marker') {
    document.getElementById('marker-tool').classList.add('active');
    document.getElementById('current-tool').textContent = 'Marker';

    canvas.isDrawingMode = true;
    canvas.selection = false;
    updateBrushSettings();
    } 
    else if (tool === 'text') {
    document.getElementById('text-tool').classList.add('active');
    document.getElementById('current-tool').textContent = 'Text';

    canvas.isDrawingMode = false;
    canvas.selection = false;
    saveState();
    updateBrushSettings();
    }
    else if (tool === 'image') {
    document.getElementById('image-tool').classList.add('active');
    document.getElementById('current-tool').textContent = 'Image';

    canvas.isDrawingMode = false;

    // Trigger the image upload dialog only if setActiveTool is called from keyboard
    }
    // ✅ Highlight tool color in palette
    highlightCurrentToolColor();
}
        


document.getElementById('jsonInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const data = JSON.parse(event.target.result);
        const json = data.canvasData;
        const width = data.width;
        const height = data.height;

        canvas.setWidth(width);
        canvas.setHeight(height);

        canvas.loadFromJSON(json, () => {
            canvas.renderAll();
            document.getElementById('canvas-container').style.width = width + 'px';
            document.getElementById('canvas-container').style.height = height + 'px';

            alert("Canvas loaded with dimensions!");
        });

        } catch (err) {
            alert("Invalid JSON file!");
            console.error(err);
        }
    };
    reader.readAsText(file);
});


// pencil tool

//currentTool = 'select'; // default tool
let pencilMode = false;     // distinguish pencil vs marker

document.getElementById('marker-tool').addEventListener('click', () => {
    pencilMode = false;
    currentTool = 'marker';
    setToolActive('marker-tool');

    canvas.isDrawingMode = true;
    canvas.selection = false;
    updateBrushSettings();  // ✅ this line was missing

});

document.getElementById('pencil-tool').addEventListener('click', () => {
    pencilMode = true;
    currentTool = 'marker'; // still use marker logic, but flag changes smoothing
    setToolActive('pencil-tool');

    canvas.isDrawingMode = true;
    canvas.selection = false;
    updateBrushSettings();  // ✅ this line was missing

});

function setToolActive(activeId) {
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(activeId).classList.add('active');
    document.getElementById('current-tool').innerText = activeId === 'marker-tool' ? 'marker' : 
                                                        activeId === 'pencil-tool' ? 'Pencil' : 
                                                        activeId === 'select-tool' ? 'Select' : 
                                                        activeId === 'text-tool' ? 'Text' : 'Tool';
}


function updateBrushSettings() {
    const tool = pencilMode ? 'pencil' : 'marker';
    const color = toolColors[tool];

    const brush = new fabric.PencilBrush(canvas);
    brush.color = color;
    brush.width = currentBrushSize;
    brush.decimate = pencilMode ? 4 : 0;

    if (pencilMode) {
        brush.shadow = new fabric.Shadow({
            blur: 0,
            offsetX: 0,
            offsetY: 0,
            affectStroke: false,
            color: color
        });
    }

    canvas.freeDrawingBrush = brush;
    console.log("Tool colors:", toolColors);

}


// Initialize brush settings
updateBrushSettings();