const ffmpeg = require("fluent-ffmpeg");
async function convertToMicStream(){
ffmpeg('final.mp3')
  .audioBitrate('141k')
  .save('test1.wav')
  .outputOptions('-v error')
  .on('end', () => {
  })
  .on('error', (err) => {
    console.error('Error converting audio:', err);
  });
}
module.exports=convertToMicStream