/* eslint-disable camelcase */
/* eslint-disable no-undef */
window.onload = () => {
  // Button to enable / disable the extension
  const extensionStateSlider = document.getElementById('extensionState');

  let extensionState = true;
  chrome.storage.local.get('brutalJukeboxState', (res) => {
    extensionState = res.brutalJukeboxState;
    extensionStateSlider.checked = extensionState;
    extensionStateSlider.dispatchEvent(new Event('change'));
  });

  extensionStateSlider.addEventListener('change', () => {
    // eslint-disable-next-line quote-props
    chrome.storage.local.set({ 'brutalJukeboxState': extensionStateSlider.checked });
    const wrap = document.getElementById('extensionStateWrapper');
    const title = wrap.querySelector('h2');
    const label = wrap.querySelector('#extensionStateWrapper > span');
    extensionState = extensionStateSlider.checked;
    if (extensionStateSlider.checked) {
      title.innerText = 'Disable extension';
      label.innerText = 'Enabled 🤩';
    } else {
      title.innerText = 'Enable extension';
      label.innerText = 'Disabled 😴';
      document.getElementById('upcomingTweet').setAttribute('nosong', 'nosong');
    }
  });

  const cancelButton = document.getElementById('cancelTweet');
  const tweetNowButton = document.getElementById('tweetNow');
  cancelButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ event: 'cancelTweet' });
    cancelButton.innerText = 'Cancelled';
    cancelButton.setAttribute('disabled', 'disabled');
    tweetNowButton.setAttribute('disabled', 'disabled');
  });

  tweetNowButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ event: 'tweetNow' });
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

  const helperStateButton = document.getElementById('helperStateButton');
  helperStateButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ event: 'checkHelper' });
  });

  function retryTweetSong(url) {
    chrome.runtime.sendMessage({ event: 'retryTweetSong', songUrl: url });
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.event === 'newSong') { // Detect if a new song is being played
      const { author_name, title, url } = msg.song;
      document.getElementById('upcomingTweet').removeAttribute('nosong');
      document.getElementById('currentSongTitle').innerText = title;
      document.getElementById('currentSongChannel').innerText = author_name;
      document.getElementById('currentSongLink').innerText = url;
      document.getElementById('currentSongLink').href = url;
      cancelButton.removeAttribute('hidden');
      tweetNowButton.removeAttribute('hidden');
      if (msg.cancelNextTweet) {
        cancelButton.innerText = 'Cancelled';
        cancelButton.setAttribute('disabled', 'disabled');
        tweetNowButton.setAttribute('disabled', 'disabled');
      } else {
        cancelButton.innerText = 'Cancel';
        cancelButton.removeAttribute('disabled');
        tweetNowButton.removeAttribute('disabled');
      }
    } else if (msg.event === 'tweetSong') { // Detect if song have been tweeted
      const listHead = document.getElementById('sessionTweet');
      listHead.innerHTML = '';
      if (msg.tweetNow) {
        cancelButton.setAttribute('disabled', 'disabled');
        tweetNowButton.setAttribute('disabled', 'disabled');
      }
      for (song of msg.songs.reverse().slice(0, 10)) {
        const el = document.createElement('li');
        el.innerText = `${song.title} by ${song.author_name}${song.tweeted ? '' : ' - FAILED'}`;
        if (!song.tweeted) {
          const songUrl = song.url;
          const retryButton = document.createElement('button');
          retryButton.innerText = '↺';
          retryButton.addEventListener('click', () => retryTweetSong(songUrl));
          el.appendChild(retryButton);
        }
        listHead.appendChild(el);
      }
    } else if (msg.event === 'helperState') { // Detect helper state
      const helperStateText = document.getElementById('helperState');
      if (msg.helperStatus) {
        helperStateText.innerText = 'Up 😀';
      } else {
        helperStateText.innerText = 'Down 😓';
      }
    }
  });

  chrome.runtime.sendMessage({ event: 'requestSong' });
  chrome.runtime.sendMessage({ event: 'checkHelper' });
};
