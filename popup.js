window.onload = function() {
    const extensionState = document.getElementById('extensionState');
    extensionState.addEventListener('change', function() {
        chrome.storage.local.set({'brutalJukeboxState': extensionState.checked});
        const wrap = document.getElementById('extensionStateWrapper');
        const title = wrap.querySelector('h2');
        const label = wrap.querySelector('#extensionStateWrapper > span');
        if (extensionState.checked) {
            title.innerText = 'Disable extension'
            label.innerText = 'Enabled 🤩'
        } else {
            title.innerText = 'Enable extension'
            label.innerText = 'Disabled 😴'
        }
    });
}