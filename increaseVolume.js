const { spawn } = require("child_process");

function increaseVolume(inputFile, outputFile, gain) {
  const soxProcess = spawn("sox", [
    inputFile,
    outputFile,
    "vol",
    `${gain}dB`
  ]);

  soxProcess.stderr.on("data", (data) => {
    console.error(`Sox error: ${data}`);
  });

  soxProcess.on("close", (code) => {
    if (code === 0) {
      console.log("Volume increased successfully!");
    } else {
      console.error(`Sox process exited with code ${code}`);
    }
  });
}

module.exports=increaseVolume