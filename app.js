const express = require("express");
const bodyParser = require("body-parser");
const csvParser = require("csv-parser");
const fs = require("fs");
const { downloadFile } = require("./helper");

const app = express();

app.use(bodyParser.json());

const results = [];

app.post("/", (req, res, next) => {
  const { csv } = req.body;
  if (!csv.url) {
    return res.status(422).json({
      message: "Link to CSV not provided",
    });
  }
  downloadFile(csv.url, "record.csv")
    .then((resp) => {
      //console.log(resp);
      fs.createReadStream(resp.path)
        .pipe(csvParser())
        .on("data", (data) => {
          const obj = {};
          if (csv.select_fields.length > 0) {
            csv.select_fields.forEach((row) => {
              obj[row] = data[row];
            });
            results.push(obj);
          } else {
            results.push(data);
          }
        })
        .on("end", () => {
          res.status(200).json({
            results,
          });
        });
    })
    .catch(console.log);
});

app.get("/", (req, res, next) => {
  fs.createReadStream("records.csv")
    .pipe(csvParser())
    .on("data", (data) => {
      if (results.length < 21) {
        results.push({
          first_name: data["First Name"],
          last_name: data["Last Name"],
          age: Math.floor(Number(data["Age in Yrs."])),
        });
      }
    })
    .on("end", () => {
      res.status(200).json({
        results,
      });
    });
});

app.listen(3000, () => {
  console.log("Server Started");
});
