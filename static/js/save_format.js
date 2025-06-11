// static/js/save_format.js


//  Download JSON file
function downloadCanvasJSON() {
const json = JSON.stringify({
canvasData: canvas.toJSON(),
width: canvas.getWidth(),
height: canvas.getHeight()
}, null, 2);

const blob = new Blob([json], { type: 'application/json' });
const link = document.createElement('a');
link.download = 'canvas.json';
link.href = URL.createObjectURL(blob);
link.click();
setTimeout(() => URL.revokeObjectURL(link.href), 1000);

}

// Download as PNG image
function downloadPNG() {
const dataURL = canvas.toDataURL({ format: 'png' });
const link = document.createElement('a');
link.download = 'canvas.png';
link.href = dataURL;
link.click();
}
   
   // download as svg
function downloadSVG() {
    const svg = canvas.toSVG();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = 'canvas.svg';
    link.href = URL.createObjectURL(blob);
    link.click();
}

function saveToLocalStorage() {
const state = {
        canvasData: canvas.toJSON(),
        width: canvas.getWidth(),
        height: canvas.getHeight(),
        palette: customColors
    };
    localStorage.setItem('autosave', JSON.stringify(state));
    console.log("Saved Now");

    document.getElementById('save-status').textContent = "✓ Saved just now";
setTimeout(() => {
    document.getElementById('save-status').textContent = "";
}, 5000);
}