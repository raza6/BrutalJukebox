/* eslint-disable camelcase */
/* eslint-disable no-undef */
window.onload = () => {
  // Button to enable / disable the extension
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

  const customSongIpt = document.getElementById('customSong');
  const customSongButton = document.getElementById('customSongSubmit');
  let customUrl = '';
  customSongIpt.addEventListener('input', (e) => {
    if (e.target.value && /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=\w+$/.test(e.target.value)) {
      customSongButton.removeAttribute('disabled');
      customUrl = e.target.value;
    } else {
      customUrl = '';
      customSongButton.setAttribute('disabled', 'disabled');
    }
  });
  customSongButton.addEventListener('click', () => {
    fetch(`https://www.youtube.com/oembed?url=${customUrl}&format=json`)
      .then((response) => response.json())
      .then((ytData) => {
        chrome.runtime.sendMessage({ event: 'customTweetSong', song: { ...ytData, url: customUrl } });
      });
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.event === 'newSong') { // Detect if a new song is being played
      const { author_name, title, url } = msg.song;
      document.getElementById('upcomingTweet').removeAttribute('nosong');
      document.getElementById('currentSongTitle').innerText = title;
      document.getElementById('currentSongChannel').innerText = author_name;
      document.getElementById('currentSongLink').innerText = url;
      document.getElementById('currentSongLink').href = url;
    } else if (msg.event === 'tweetSong') { // Detect if song have been tweeted
      const listHead = document.getElementById('sessionTweet');
      listHead.innerHTML = '';
      for (song of msg.songs.reverse().slice(0, 10)) {
        const el = document.createElement('li');
        el.innerText = `${song.title} by ${song.author_name}`;
        listHead.appendChild(el);
      }
    }
  });

  chrome.runtime.sendMessage({ event: 'requestSong' });
};
