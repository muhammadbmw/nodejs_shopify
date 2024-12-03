const express = require("express");
//const { parse } = require("csv-parse");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const sendDataToShopify = require("./sendData");

// Multer Configuration
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
});

app.post("/api/upload", upload.single("file"), (req, res, next) => {
  if (!req.file) {
    const error = new Error("File attachment not found!");
    error.status = 400;
    return next(error);
  }
  const fileType = path.extname(req.file.originalname).toLowerCase();
  if (fileType !== ".csv") {
    const error = new Error("CSV file format only!");
    error.status = 400;
    return next(error);
  }
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
      sendDataToShopify(data);
    })
    .on("end", () => {
      fs.unlink(req.file.path, () => {
        // file deleted
      });
      res.json({
        message: "File uploaded successfully",
        data: results,
      });
    });

  // res.json({
  //   message: "File uploaded successfully",
  //   filename: req.file,
  // });
});

// const parser = parse({ columns: true }, function (err, records) {
//   console.log(records);
// });
// fs.createReadStream(__dirname + "/searchresults.csv").pipe(parser);

//Error Handler
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
