# google-meet-gpt-integeration
# Speech-to-Text and Text-to-Speech Automation

## Prerequisites

- Node.js
- FFmpeg
- SoX (Sound eXchange)
- Google Cloud SDK (for authentication and accessing the STT and TTS APIs)
- Deepgram
- Puppeteer-extra
- Alots alots of patience and determination

## Installation

1. Clone the repository.
2. Navigate to the cloned directory.
3. Install the dependencies.
4. Set up environment variables in a `.env` file.

## Usage

Run the script with the command `node mainBot.js`.

The script performs the following tasks:

1. Launches a headless browser using Puppeteer and navigates to a meeting URL.
2. Joins the meeting by clicking the appropriate button.
3. Prompts for the user's name and clicks the join button.
4. Records audio from the browser using SoX.
5. Processes the recorded audio: converts it to mono, increases the volume, and saves it.
6. Transcribes the processed audio using Deepgram and use OpenAI GPT to Generate a GPT response.
7. Synthesizes a response using the Google Cloud Text-to-Speech API.
8. Writes the synthesized response to an audio file.
9. Converts the synthesized audio to a microphone stream and plays it in the browser.
10. Closes the browser and ends the script.

Modify the script as needed and explore additional functionalities.

### Environment Variables

Create a `.env` file in the project directory and set the following environment variables:

- `GPT_KEY`: Your OpenAI GPT API key.
- `DEEPGRAM_KEY`: Your Deepgram API key.

### Audio Files

The `./audios` directory contains the following audio files:

- `fromBrowser.wav`: The recorded audio from the browser.
- `output.wav`: The processed audio (converted to mono and increased volume).
- `final.wav`: The synthesized response audio.

You can use these files for further analysis or customization.

Remember to respect the terms of service and privacy of the services used in this project.

For any questions or issues, please contact arjundhawan2002@gmail.com.
