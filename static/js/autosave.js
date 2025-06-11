// static/js/autosave.js


// autosave logic
setInterval(() => {
    const state = {
        canvasData: canvas.toJSON(),
        width: canvas.getWidth(),
        height: canvas.getHeight(),
        palette: customColors
    };
    localStorage.setItem('autosave', JSON.stringify(state));
    console.log("Saved Now")
}, 15000);