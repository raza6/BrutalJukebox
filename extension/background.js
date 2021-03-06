/* eslint-disable no-undef */
let extensionState = true;
const playedMusic = [];
const tweetedSongs = [];
let lastValidSong;
let cancelNextTweet = false;

console.log('BrutalJukebox started');

// Make the call to the local server to post a tweet
function postTweet(song) {
  const tweet = `🎵 Bobby is listening to ${song.title} by ${song.author_name} on ${song.url} 🎵`;
  console.log('Tweet 🐤 :', tweet);
  fetch('http://localhost:3000/newsong', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tweet }),
  }).then((response) => response.text()).then((text) => console.log(text));

  tweetedSongs.push(song);
  chrome.runtime.sendMessage({ event: 'tweetSong', songs: tweetedSongs });
}

// Determine if an open is ytbMusic and parse it if its a new song
function mainJukebox(tabId, changeInfo, tab) {
  console.log('New tab detected 😎', changeInfo, tab);
  const { audible, title } = tab;
  if (audible) {
    if (!playedMusic.includes(title) && title !== 'YouTube Music') {
      playedMusic.push(title);

      if (lastValidSong !== undefined) {
        if (cancelNextTweet) {
          cancelNextTweet = false;
        } else {
          postTweet(lastValidSong);
        }
      }

      let ytURL = tab.url;
      ytURL = ytURL.replace('music', 'www');
      // eslint-disable-next-line prefer-destructuring
      ytURL = ytURL.match(/(.*)&list/)[1];
      fetch(`https://www.youtube.com/oembed?url=${ytURL}&format=json`)
        .then((response) => response.json())
        .then((ytData) => {
          lastValidSong = { ...ytData, url: ytURL };
          chrome.runtime.sendMessage({ event: 'newSong', song: lastValidSong, cancelNextTweet });
        });
    }
    console.log('Music played so far', playedMusic);
  }
}

chrome.runtime.onStartup.addListener(() => {
  // Detect new music played in youtubeMusic tab
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (extensionState && tab.url.includes('https://music.youtube.com/watch')) {
      mainJukebox(tabId, changeInfo, tab);
    }
  });

  // Detect if extension is enabled / disabled
  chrome.storage.local.onChanged.addListener((stored) => {
    if (stored.brutalJukeboxState) {
      extensionState = stored.brutalJukeboxState.newValue;
      if (extensionState) {
        chrome.browserAction.setIcon({ path: './images/bj32.png' });
      } else {
        chrome.browserAction.setIcon({ path: './images/bj32wb.png' });
      }
    }
  });

  // Detect if popup page need update
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.event === 'requestSong' && extensionState) {
      if (lastValidSong) {
        chrome.runtime.sendMessage({ event: 'newSong', song: lastValidSong, cancelNextTweet });
        chrome.runtime.sendMessage({ event: 'tweetSong', songs: tweetedSongs });
      }
    }
  });

  // Custom tweet
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.event === 'customTweetSong') {
      postTweet(msg.song);
    }
  });

  // Cancel next tweet
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.event === 'cancelTweet') {
      cancelNextTweet = true;
    }
  });
});
