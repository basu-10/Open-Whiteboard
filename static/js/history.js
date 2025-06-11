// static/js/history.js


function saveState() {
    // Save only the current state and future states (if any)
    if (historyPointer < canvasHistory.length - 1) {
        canvasHistory = canvasHistory.slice(0, historyPointer + 1);
    }
    
    const json = JSON.stringify(canvas.toJSON());
    canvasHistory.push(json);
    historyPointer = canvasHistory.length - 1;
    
    // Limit history to 50 states
    if (canvasHistory.length > 50) {
        canvasHistory.shift();
        historyPointer--;
    }
    
    updateObjectCount();
}

function undo() {
    if (historyPointer <= 0) return;
    
    historyPointer--;
    loadState(canvasHistory[historyPointer]);
}

function redo() {
    if (historyPointer >= canvasHistory.length - 1) return;
    
    historyPointer++;
    loadState(canvasHistory[historyPointer]);

}
// Undo/Redo
document.getElementById('undo-btn').addEventListener('click', undo);
document.getElementById('redo-btn').addEventListener('click', redo);


function loadState(json) {
            canvas.loadFromJSON(JSON.parse(json), () => {
                canvas.renderAll();
                updateObjectCount();
                updateCanvasSizeDisplay();
            });
        }
        
function updateObjectCount() {
    document.getElementById('object-count').textContent = canvas.getObjects().length;
}