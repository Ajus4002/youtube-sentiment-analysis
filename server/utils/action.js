const Downloader = require("./downloader");
const { v4: uuidv4 } = require('uuid');
const ffmpeg = require('fluent-ffmpeg');
const {analyseText, classifyTextAllTaxonomy} = require("./expert-nlp");
const {transcribe} = require("./transcribe");

const dl = new Downloader();

async function transcribeVideo(videoId, from = null, to = null) {
    const fileName = uuidv4();
    const filePath = process.env.APP_AUDIO_PATH + '/'
    const outFile = filePath + fileName + '.wav';

    await dl.getMP3({videoId: videoId, name: fileName + ".mp3"});
    await prepareAudio({file: filePath + fileName + '.mp3', saveAs: outFile, from, to})
    return await transcribe(outFile)
}

async function transcribeDemoVideo(videoId, from = null, to = null) {
    if (videoId !== 'fboaQ5i2amc') {
        throw new Error("Invalid video id");
    }

    const { transcribe } = require('./transcribe-demo');
    return await transcribe()
}

async function prepareAudio({ file, saveAs, from, to }) {
    return new Promise(((resolve, reject) => {
        const cmd = ffmpeg(file)
            .audioCodec('pcm_s16le')
            .audioChannels(1)
            .audioBitrate('8000')
            .toFormat('wav')
            .on('error', (err) => reject(err))
            .on('end', () => {
                resolve();
            });

        if (from) cmd.seekInput(from)
        if (to) cmd.withDuration(to)

        cmd.save(saveAs);
    }))
}

module.exports = {
    transcribeVideo, analyseText, classifyTextAllTaxonomy, transcribeDemoVideo
}
