const fs = require("fs");
const https = require("https");

exports.downloadFile = (url, savePath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(savePath);
    https.get(url, (response) => {
      response.on("data", (chunk) => {
        file.write(chunk);
      });
      response.on("end", () => {
        console.log("File Download Complete");
        resolve(file);
      });
      response.on("error", (err) => {
        console.log(err);
      });
    });
  });
};
