let extensionState = true;
const playedMusic = [];
const tweetedSongs = [];
let lastValidSong;

function postTweet(song) {
    console.log('Tweet 🐤', song);
    tweetedSongs.push(song);
    chrome.runtime.sendMessage({ event: 'tweetSong', songs: tweetedSongs });
}

function mainJukebox(tabId, changeInfo, tab) {
    console.log('😎', changeInfo, tab);
    const { audible, title } = tab;
    if (audible) {
        if (!playedMusic.includes(title) && title !== 'YouTube Music') {
            playedMusic.push(title);

            if (lastValidSong !== undefined) {
                postTweet(lastValidSong);
            }

            let ytURL = tab.url;
            ytURL = ytURL.replace('music', 'www');
            // eslint-disable-next-line prefer-destructuring
            ytURL = ytURL.match(/(.*)&list/)[1];
            fetch(`https://www.youtube.com/oembed?url=${ytURL}&format=json`)
                .then((response) => response.json())
                .then((ytData) => {
                    lastValidSong = { ...ytData, url: ytURL };
                    chrome.runtime.sendMessage({ event: 'newSong', song: lastValidSong });
                });
        }
        console.log(playedMusic);
    }
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (extensionState && tab.url.includes('https://music.youtube.com/watch')) {
            mainJukebox(tabId, changeInfo, tab);
        }
    });

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

    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.event === 'requestSong') {
            if (lastValidSong) {
                chrome.runtime.sendMessage({ event: 'newSong', song: lastValidSong });
                chrome.runtime.sendMessage({ event: 'tweetSong', songs: tweetedSongs });
            }
        }
    });
});
