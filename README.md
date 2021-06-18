
## Youtube Sentiment Analysis (Browser Extension)
An firefox and chrome browser extention to analyse youtube video sentiment. Nodejs is used for server and Vue with Quasar framework is used for browser extension.

### Installation
#### Server
1. `cd server`
2. Copy `.env.example` to `.env`  and fill out the details
3. `yarn install`
4. `npm start`

#### Browser extension
1. `cd bex`
2. Set env variable `API_BASE_URL` in `quasar.conf.js` (build.env.API_BASE_URL)
3. `npm install`
4. `npm start`

### Working
1. Install extension
2. Click Analyze button from YouTube video
3. Video Id sent to server for transcription
    * Download YouTube video as audio
    * Convert audio to required format
    * Audio processed by google speech to text
    * Response sent to browser
4. Get text to analyze from response
5. Send text to expert.ai to analyze and classify the text
6. Response is displayed in browser extension
