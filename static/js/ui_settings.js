// static/js/ui_settings.js

const settingsBtn = document.getElementById('settings-btn');
const settingsMenu = document.getElementById('settings-menu');

settingsBtn.addEventListener('click', () => {
    settingsMenu.style.display = (settingsMenu.style.display === 'flex') ? 'none' : 'flex';
});

// Optional: Click outside to close
document.addEventListener('click', (e) => {
    if (!settingsBtn.contains(e.target) && !settingsMenu.contains(e.target)) {
        settingsMenu.style.display = 'none';
    }
});