const express = require('express')
const expressWebSocket = require("express-ws");
const bodyParser = require('body-parser');
const {analyseText, classifyTextAllTaxonomy, transcribeVideo} = require("./utils/action");

const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let httpServ;
if (process.env.SSL_CERT && process.env.SSL_KEY) {
    httpServ = require('https').createServer({ key: process.env.SSL_KEY, cert: process.env.SSL_CERT }, app);
} else {
    httpServ = require('http').createServer(app);
}

expressWebSocket(app, httpServ);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.ws('/', (ws, req) => {
    ws.on('message', async e => {
        const data = JSON.parse(e.data);

        if (data.action === 'transcribe-video') {
            try {
                const res = await transcribeVideo(data.video, data.from, data.to)
                ws.send(JSON.stringify({message: 'video-transcription', success: true, data: res}))
            } catch (e) {
                ws.send(JSON.stringify({message: 'video-transcription', success: false}))
            }
        }

        if (data.action === 'analyse-text') {
            try {
                const res = await analyseText(data.text)
                ws.send(JSON.stringify({message: 'text-nlp', success: true, data: res}))
            } catch (e) {
                ws.send(JSON.stringify({message: 'text-nlp', success: false}))
            }
        }
    })
});

app.post('/text/analyse', async (req, res) => {
    try {
        const data = await analyseText(req.body.text)
        res.send(data)
    } catch (e) {
        res.status(500)
        res.send()
    }
})

app.post('/text/classify/all', async (req, res) => {
    try {
        const data = await classifyTextAllTaxonomy(req.body.text)
        res.send(data)
    } catch (e) {
        res.status(500)
        res.send(e)
    }
})

app.post('/video/transcribe', async (req, res) => {
    try {
        if (!req.body.videoId) {
            throw new Error("Invalid Video Id");
        }

        const data = await transcribeVideo(req.body.videoId, req.body.from, req.body.to)
        res.send(data)
    } catch (e) {
        res.status(500)
        res.send(e)
    }
})

const listener = httpServ.listen(process.env.APP_PORT ?? 3006, () => {
    console.log("Your app is listening on port " + listener.address().port);
});
