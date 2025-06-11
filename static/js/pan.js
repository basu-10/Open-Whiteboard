// static/js/pan.js
// 
// // pan with mouse support

let isDragging = false;
let lastPosX, lastPosY;

canvas.on('mouse:down', function(opt) {
    if (opt.e.ctrlKey) {
        isDragging = true;
        canvas.selection = false;
        lastPosX = opt.e.clientX;
        lastPosY = opt.e.clientY;
    }
});

canvas.on('mouse:move', function(opt) {
    if (isDragging) {
        const e = opt.e;
        const vpt = canvas.viewportTransform;
        vpt[4] += e.clientX - lastPosX;
        vpt[5] += e.clientY - lastPosY;
        canvas.requestRenderAll();
        lastPosX = e.clientX;
        lastPosY = e.clientY;
    }
});

