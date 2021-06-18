const YoutubeMp3Downloader = require("youtube-mp3-downloader");

const Downloader = function() {
    const self = this;

    self.YD = new YoutubeMp3Downloader({
        "ffmpegPath": process.env.FFMPEG_PATH,
        "outputPath": process.env.APP_AUDIO_PATH,
        "youtubeVideoQuality": "highestaudio",
        "queueParallelism": 2,
        "progressTimeout": 2000
    });

    self.callbacks = {};

    self.YD.on("finished", function(error, data) {
        if (self.callbacks[data.videoId]) {
            self.callbacks[data.videoId](error, data);
        } else {
            console.log("Error: No callback for videoId!");
        }
    });

    self.YD.on("error", function(error, data) {
        console.error(error + " on videoId " + data?.videoId);

        if (self.callbacks[data?.videoId]) {
            self.callbacks[data?.videoId](error, data);
        } else {
            console.log("Error: No callback for videoId!");
        }
    });
};

Downloader.prototype.getMP3 = async function(track) {
    return new Promise(((resolve, reject) => {
        const self = this;
        self.callbacks[track.videoId] = (err, res) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(res);
        };
        self.YD.download(track.videoId, track.name);
    }))
};

module.exports = Downloader;
