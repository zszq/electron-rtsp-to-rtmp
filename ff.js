var outputh = 'rtsp://' + 'ip' + ':' + 'port' + '/' + textname;
var ffmpegPath = "./ffmpeg_bin/ffmpeg.exe";
var ffmpeg = require('fluent-ffmpeg');

command = new ffmpeg('video=HD USB Camera')
    .setFfmpegPath(ffmpegPath)
    .inputOptions('-f dshow')
    .size('800x600')
    .on('start', function(commandLine) {
        console.log("start push......." + commandLine);
        console.log("start command......." + command);
    })
    .on('end', function() {
        console.log("storp push........")
        stopPush();
    })
    .on('error', function(err, stdout, stderr) {
        console.log('error:' + err.message);
        console.log('stdout:' + stdout);
        console.log('stderr:' + stderr);
        stopPush();
    })
    .addOptions([
        // '-preset veryfast',
        '-rtsp_transport tcp',
        '-f rtsp'
    ])
    .pipe(outputh, { end: true });`
