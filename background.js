let extensionState = true;
let playedMusic = [];
let lastValidSong;

chrome.runtime.onInstalled.addListener(function() {
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
		if (extensionState && tab.url.includes('https://music.youtube.com/watch')) {
            mainJukebox(tabId, changeInfo, tab);
		}
	});
    
    chrome.storage.local.onChanged.addListener(function(stored) {
        if(stored.brutalJukeboxState) {
            extensionState = stored.brutalJukeboxState.newValue;
            if (extensionState) {
                chrome.browserAction.setIcon({path: './images/bj32.png'})
            } else {
                chrome.browserAction.setIcon({path: './images/bj32wb.png'})
            }
        }
    });
	
	chrome.runtime.onMessage.addListener(msg => {
		if (msg.event === 'requestSong') {
			chrome.runtime.sendMessage({event: 'newSong', song: lastValidSong});
		}
	});
});

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
			ytURL = ytURL.match(/(.*)&list/)[1];
			fetch(`https://www.youtube.com/oembed?url=${ytURL}&format=json`)
			.then(response => response.json())
			.then(ytData => {
				lastValidSong = {...ytData, url: ytURL};
				console.log(ytURL);
				chrome.runtime.sendMessage({event: 'newSong', song: lastValidSong});
			});
		}
		console.log(playedMusic);
	}
}

function postTweet(song) {
	console.log('Tweet 🐤', song);
}