# Wit.ai Jam

![banner](https://i.ibb.co/5F0FMMB/browsit-banner.png)

Browsit is a voice-enabled browser assistant, packaged as a Chrome extension.

## Configuration 

Due to CORS restrictions, you'll need to have a proxy running. Instructions on [this repository](https://github.com/Rob--W/cors-anywhere).

Run `cp .env.example .env` and add your Wit.ai access token.

## Development flow

### 1. Install packages

`yarn`

### 2. Build & install extension

`yarn && yarn build`

Open Chrome, `chrome://extensions`, `Load Unpacked`, and select the `build/` folder. 

### 3. Start React component

`yarn start`

### 4. Test

Open any webpage, allow microphone usage, and start speaking!

Example flow:
- Can you click on "Write something"
- Now enter "Hello Facebook team" in the "What are you working on" input field
- Perfect, you can press Post
- Ok... Scroll down a little bit
- Can you zoom in on that?