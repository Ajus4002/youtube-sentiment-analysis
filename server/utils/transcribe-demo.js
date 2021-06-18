const fs = require('fs');

async function transcribe(fileName) {
    const response = JSON.parse(fs.readFileSync('./cache.json').toString());
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

module.exports = {
    transcribe
}
