// static/js/keyboard_shortcut.js

// Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();

    if (key === 's') setActiveTool('select');
    else if (key === 'm') setActiveTool('marker');
    else if (key === 't') setActiveTool('text');
    else if (key === 'i') document.getElementById('image-tool').click();

    if (e.ctrlKey && key === 'z') undo();
    if (e.ctrlKey && key === 'y') redo();

    if (e.key === 'Delete') {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects && activeObjects.length > 0) {
            canvas.remove(...activeObjects);
            saveState();
        }
    }

    if (key === 'h') {
        const instr = document.querySelector('.instructions');
        if (instr) {
            instr.style.display = (instr.style.display === 'none' || instr.style.display === '') ? 'block' : 'none';
        }
    }
});