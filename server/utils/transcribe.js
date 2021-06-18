const fs = require('fs');
const speech = require('@google-cloud/speech').v1p1beta1;

async function transcribe(fileName) {
    const response = await streamAudio(fileName);
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

    const result = response.results[response.results.length - 1];
    const wordsInfo = result.alternatives[0].words;

    const speakerDiarization = [];

    let currentSpeaker = null;
    wordsInfo.forEach(a => {
        if (!currentSpeaker) {
            a.words = [];
            currentSpeaker = a;
            return;
        }

        if (currentSpeaker['speakerTag'] === a['speakerTag']) {
            currentSpeaker['words'].push(a.word);
            currentSpeaker.endTime = a.endTime;
            return;
        }

        const text = {
            text: currentSpeaker['words'].join(' '),
            speaker: currentSpeaker['speakerTag'],
            startTime: currentSpeaker['startTime'],
            endTime: currentSpeaker['endTime']
        }

        speakerDiarization.push(text);

        a.words = [];
        currentSpeaker = a;
    });

    return {
        transcription, speakerDiarization
    }
}

async function streamAudio(filename) {
    return new Promise(((resolve, reject) => {
        const client = new speech.SpeechClient();

        const request = {
            config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 8000,
                languageCode: 'en-US',
                enableSpeakerDiarization: true,
                enableAutomaticPunctuation: true
            },
            interimResults: false,
        };

        const recognizeStream = client
            .streamingRecognize(request)
            .on('error', () => reject())
            .on('data', data => {
                resolve(data)
            });

        fs.createReadStream(filename).pipe(recognizeStream);
    }))
}

module.exports = {
    transcribe
}
