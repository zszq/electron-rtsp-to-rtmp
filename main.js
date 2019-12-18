// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')


// main.js 部分功能代码
const ffmpeg = require('fluent-ffmpeg');
const NodeMediaServer = require('node-media-server');
var ffmpegPath = "./ffmpeg-4.2.1-win64-static/bin/ffmpeg.exe";

// rtmp 播放 服务器
  const config = {
    rtmp: {
      port: 1938,
      chunk_size: 60000,
      gop_cache: true,
      ping: 60,
      ping_timeout: 30
    },
    http: {
      port: 8000,
      allow_origin: '*'
    }
  };
  var nms = new NodeMediaServer(config)
  nms.run();

// 转码指令
const uri = 'rtsp://3.84.6.190/vod/mp4:BigBuckBunny_115k.mov' //测试
var command = ffmpeg(uri)
    .setFfmpegPath(ffmpegPath)
    .outputOptions([
      '-fflags',
      'nobuffer',
      '-vcodec',
      'libx264',
      '-preset',
      'superfast',
      '-rtsp_transport',
      'tcp',
      '-threads',
      '2',
      // '-f',
      // 'flv',
      '-r',
      '25',
      // '-s',
      // '640x480',
      //'1280x720',
      '-an'
    ])
    .inputFPS(25)
    .noAudio()
    .size('640x?')
    .aspect('4:3')
    .format('flv')
    // 此处的 /live/camera, camera类似于一个房间的概念, 你可以设置为你想要的名字
    .save(`rtmp://localhost:1938/live/livestream`)
    .on('start', function (e) {
      running = true
      console.log('stream is start: ' + e)
      console.log("start command......." + command);
    })
    .on('end', function () {
      running = false
      console.log('ffmpeg is end')
    })
    .on('error', function (err) {
      running = true
      console.log('ffmpeg is error! ' + err)
      // command.kill()
      //reloadStream(uri)
    })


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    command.kill()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
