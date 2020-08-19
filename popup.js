/* eslint-disable camelcase */
window.onload = () => {
    const extensionState = document.getElementById('extensionState');
    extensionState.addEventListener('change', () => {
        // eslint-disable-next-line quote-props
        chrome.storage.local.set({ 'brutalJukeboxState': extensionState.checked });
        const wrap = document.getElementById('extensionStateWrapper');
        const title = wrap.querySelector('h2');
        const label = wrap.querySelector('#extensionStateWrapper > span');
        if (extensionState.checked) {
            title.innerText = 'Disable extension';
            label.innerText = 'Enabled 🤩';
        } else {
            title.innerText = 'Enable extension';
            label.innerText = 'Disabled 😴';
        }
    });

    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.event === 'newSong') {
            const { author_name, title, url } = msg.song;
            document.getElementById('currentSongTitle').innerText = title;
            document.getElementById('currentSongChannel').innerText = author_name;
            document.getElementById('currentSongLink').innerText = url;
            document.getElementById('currentSongLink').href = url;
        }
    });
    chrome.runtime.sendMessage({ event: 'requestSong' });
};
