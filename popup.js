window.onload = function() {
    const extensionState = document.getElementById('extensionState');
    extensionState.addEventListener('change', function() {
        chrome.storage.local.set({'brutalJukeboxState': extensionState.checked});
    });
}