// static/js/ui_canvas.js
window.addEventListener('load', () => {

    canvas.on('object:added', updateObjectCount);
    canvas.on('object:removed', updateObjectCount);
    canvas.on('object:modified', saveState);

    canvas.on('mouse:up', function () {
        isDragging = false;
        canvas.selection = true;
        if (canvas.isDrawingMode) {
            saveState();
        }
    });

    function updateCanvasSizeDisplay() {
        document.getElementById('canvas-size').textContent =
            `${canvas.getWidth()}x${canvas.getHeight()}`;
    }

    function addPage(direction) {
        const currentWidth = canvas.getWidth();
        const currentHeight = canvas.getHeight();
        const offset = 200;
        let newWidth = currentWidth;
        let newHeight = currentHeight;

        console.log("Expanding canvas on:", direction);
        console.log("Old size:", canvas.getWidth(), canvas.getHeight());


        switch (direction) {
            case 'top':
                newHeight = currentHeight + offset;
                canvas.setHeight(newHeight);
                canvas.forEachObject(obj => {
                    obj.set('top', obj.top + offset);
                });
                break;
            case 'bottom':
                newHeight = currentHeight + offset;
                canvas.setHeight(newHeight);
                break;
            case 'left':
                newWidth = currentWidth + offset;
                canvas.setWidth(newWidth);
                canvas.forEachObject(obj => {
                    obj.set('left', obj.left + offset);
                });
                break;
            case 'right':
                newWidth = currentWidth + offset;
                canvas.setWidth(newWidth);
                break;
        }

        canvas.renderAll();
        updateCanvasSizeDisplay();
        saveState();
    }

    document.getElementById('add-top').addEventListener('click', () => addPage('top'));
    document.getElementById('add-bottom').addEventListener('click', () => addPage('bottom'));
    document.getElementById('add-left').addEventListener('click', () => addPage('left'));
    document.getElementById('add-right').addEventListener('click', () => addPage('right'));

    // Clear canvas
    document.getElementById('clear-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the canvas?')) {
            canvas.clear();
            canvas.backgroundColor = '#ffffff';
            canvas.setWidth(initialWidth);
            canvas.setHeight(initialHeight);
            updateCanvasSizeDisplay();
            saveState();
        }
    });

});
