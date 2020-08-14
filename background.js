chrome.runtime.onInstalled.addListener(function() {
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
		if (tab.url.includes('https://music.youtube.com/watch')) {
			mainJukebox(tabId, changeInfo, tab);
		}
	});
});

let playedMusic = [];
let lastValidTab;

function mainJukebox(tabId, changeInfo, tab) {
	console.log('😎', changeInfo, tab);
	const { audible, title } = tab;
	if (audible) {
		if (!playedMusic.includes(title) && title !== 'YouTube Music') {
			playedMusic.push(title);
			if (lastValidTab !== undefined) {
				postTweet(lastValidTab);
			}
			lastValidTab = {tabId, ...tab};
		}
		console.log(playedMusic);
	}
}

function postTweet(tabTweet) {
	console.log('Tweet 🐤', tabTweet);
	chrome.tabs.executeScript(tabTweet.tabId, {code: 'return document'}, () => console.log);
}