# BrutalJukebox

Brutal Jukebox is a chrome extension / twitter bot that automatically tweets the song you are listening to on YouTube Music.

## Prerequisites

You will need a chromium-based browser to install the extension and a valid install of [Node.js](https://nodejs.org/en/).

Moreover, you will need a Twitter account and access to the Twitter developer portal. Create a project in read + write mode with 3rd party auth disabled and retrieve / create the following credentials:
- app key
- app key secret
- access token
- access token secret

## Installation

Install the extension by going on the chromium extension page and click the 'Load unpacked' button and select the extension directory.

The extension can tweet by using a local node server that act as a middleman. Copy the file `twitcred.template.json` and rename it `twitcred.json`. Fill it with your Twitter credentials previously created.

Run `npm install` in the nodeServer folder.

To start the local server: `node index.js`. The extension won't work if the server is down.

## Usage

Open your browser, make sure you can see the icon of the extension. Start playing a song on music.youtube.com. It should appear in the extension popup. The song will be automatically tweeted if another song starts playing.

You can disable the whole extension with the slider at the bottom. This setting will be remembered accross sessions. On the other hand, if you just want to cancel the tweet of the song currently playing, you can press the cancel button.

If you want to tweet a song that is not available on YouTube Music, copy/paste a YouTube url in the custom song field.

## Acknowledgment

This project uses [express](http://expressjs.com) and [twit](https://github.com/ttezel/twit).

## Final warning

This project is probably full of bugs and scrappy code, feel free to improve it 😉
