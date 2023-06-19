const { launch, getStream } = require("puppeteer-stream");
const { spawn } = require("child_process");
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
require('dotenv').config
myHeaders.append(
  "Authorization",
  `Bearer ${process.env.GPT_KEY}`
);

//Update Meeting URL here in this format
const meetingUrl = "https://meet.google.com/mhx-ioru-jhb";

const fs = require("fs");
const util = require("util");
const { Deepgram } = require("@deepgram/sdk");
const deepgramApiKey = process.env.DEEPGRAM_KEY;
const convertToMicStream = require("./convertToMicStream");
const increaseVolume = require("./increaseVolume.js");
const { createAudioFile } = require("simple-tts-mp3");
const puppeteer = require("puppeteer");
const ffmpeg = require("fluent-ffmpeg");
const textToSpeech = require("@google-cloud/text-to-speech");
const ttSclient = new textToSpeech.TextToSpeechClient({
  keyFilename: "key.json",
});
const speech = require("@google-cloud/speech");
const client = new speech.SpeechClient({
  keyFilename: "key.json",
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const encoding = "LINEAR16";
const sampleRateHertz = 48000;
const languageCode = "en-US";
const inputFile = "./audios/fromBrowser.wav";
const outputFile = "./audios/output.wav";
const outputFileTTS = "./audios/final.wav";


async function textToSpeechGoogle(transcription) {
  const request2 = {
    input: { text: transcription },
    voice: { languageCode: "en-US", ssmlGender: "FEMALE" },
    audioConfig: { audioEncoding: "MP3" },
  };

  const [responseText] = await ttSclient.synthesizeSpeech(request2);
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(outputFileTTS, responseText.audioContent, "binary");
  console.log(`Audio content written to file: ${outputFileTTS}`);
}

async function speechToTextGOOGLE() {
  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  };

  const audio = {
    content: fs.readFileSync("./audios/output.wav").toString("base64"),
  };

  const request = {
    config: config,
    audio: audio,
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");
  fs.writeFileSync("stt.txt", transcription);
  console.log("Transcription: ", transcription);

  await browser.close();
}

async function joinMeeting() {
  //Creating a Fake audio mic stream and video-> Filling this fake audio mic stream with GPT response
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
    ignoreDefaultArgs: ["--mute-audio"],
    args: [
      "--start-maximized",
      "--use-fake-ui-for-media-stream",
      "--use-fake-device-for-media-stream",
      "--use-file-for-fake-audio-capture=C:\\Users\\arjun\\OneDrive\\Desktop\\mercor\\audios\\micStream.wav",
    ],
  });
  //Update --use-file-for-fake-audio-capture above with your project path
  const page = await browser.newPage();
  await page.goto(meetingUrl);

  //checking for popups that might crash bot.
  const micElement = await page.$(
    "button.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.LQeN7.jEvJdc.nXKkSb"
  );
  var flag = 0;
  if (micElement) {
    flag = 1;
    await micElement.click();
    console.log("micElement is present.");
  } else {
    console.log("micElement is not present.");
  }
  const Startelement = await page.$(
    "button.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.LQeN7.jEvJdc.nXKkSb"
  );

  if (Startelement && flag == 0) {
    await page.waitForSelector(
      "button.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.LQeN7.jEvJdc.nXKkSb"
    );
    await Startelement.click();
    console.log("Startelement is present.");
  } else {
    console.log("Startelement is not present.");
  }

  //Joining Meeting and handling popups and inserting username as 'test user' to enter meeting
  await page.waitForSelector("input.VfPpkd-fmcmS-wGMbrd");
  await page.type("input.VfPpkd-fmcmS-wGMbrd", "test user");
  await page.waitForSelector(
    ".U26fgb.JRY2Pb.mUbCce.kpROve.yBiuPb.y1zVCf.HNeRed.M9Bg4d"
  );
  await sleep(2000);
  await page.click(".U26fgb.JRY2Pb.mUbCce.kpROve.yBiuPb.y1zVCf.HNeRed.M9Bg4d");
  // await page.waitForSelector(".U26fgb.JRY2Pb.mUbCce.kpROve.yBiuPb.y1zVCf.M9Bg4d.FTMc0c.N2RpBe.jY9Dbb");
  // await page.click(".U26fgb.JRY2Pb.mUbCce.kpROve.yBiuPb.y1zVCf.M9Bg4d.FTMc0c.N2RpBe.jY9Dbb");
  await page.waitForSelector(
    "button.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.LQeN7.jEvJdc.QJgqC"
  );
  await page.click(
    "button.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.LQeN7.jEvJdc.QJgqC"
  );
  await sleep(5000);
  transcribeAndReplyGPT(page, browser);
}

async function transcribeAndReplyGPT(page, browser) {
  console.log("Main Logic of Transcribing and Everything started");

  console.log("Recording Starting");
  const soxProcess = spawn("sox", [
    "-d",
    "-c",
    "1",
    "-r",
    "44100",
    "-e",
    "signed-integer",
    "-b",
    "16",
    inputFile,
  ]);
  const inputStream = fs.createWriteStream(inputFile);
  soxProcess.stdout.pipe(inputStream);
  //Handle recording errors
  soxProcess.on("error", (err) => {
    console.error("An error occurred:", err);
  });
  //Stop Recording Event
  soxProcess.on("close", (code) => {
    console.log(`SoX process exited with code ${code}`);
    increaseVolume("./audios/fromBrowser.wav", "./audios/outputIncreasedVol.wav", 15);
    //Reducing recording's channels to 1 to make ready for Transcribing
    ffmpeg("./audios/outputIncreasedVol.wav")
      .audioChannels(1)
      .outputOptions("-strict -2")
      .save(outputFile)
      .on("end", async function () {
        console.log("Conversion To Mono complete!");
        const mimetype = "audio/wav";
        //Transcribing the question/dialogue by user
        const deepgram = new Deepgram(deepgramApiKey);

        deepgram.transcription
          .preRecorded(
            { buffer: fs.readFileSync(outputFile), mimetype },
            { punctuate: true, language: "en-US" }
          )
          .then(async (transcription) => {
            //Creating a Prompt for ChatGPT
            const prompt =
              `Reply as a human: ${transcription.results.channels[0].alternatives[0].transcript}` ||
              "Reply as a human:What is ChatGPT";
            // console.log("ChatGPT response:", response);
            console.log("Prompt:", prompt);
            var raw = JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "user",
                  content: prompt,
                },
              ],
            });

            var requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: raw,
              redirect: "follow",
            };
            //Ask for OpenAI GPT response
            var text = await fetch(
              "https://api.openai.com/v1/chat/completions",
              requestOptions
            );
            text = await text.json();
            text =
              text.choices[0].message.content ||
              "ChatGPT is a chatbot that utilizes natural language processing (NLP) to engage in conversations with users. It employs machine learning algorithms and sophisticated language models to allow for interactive discussions. ChatGPT can help people find information, provide customer support, or simply provide entertainment through its conversational capabilities.";
            console.log("ChatGpt reply:", text);
            //convert text to speech
            await createAudioFile(text.toString(), "final");
            await sleep(2000);
          })
          .then(async () => {
            //Play mic to reply to user
            convertToMicStream();
            await page.goto(meetingUrl);
            await sleep(5000);

            // await page.click("div.VfPpkd-TkwUic.VfPpkd-ksKsZd-mWPk3d-OWXEXe-AHe6Kc-XpnDCe.VfPpkd-ksKsZd-mWPk3d");
            await sleep(10000);
            await browser.close();
          })

          .catch((err) => {
            console.log(err);
          });
      })
      .on("error", function (err) {
        console.log("An error occurred: " + err.message);
      });
  });
  setTimeout(() => {
    soxProcess.kill();
  }, 1000 * 14);
}

joinMeeting();
