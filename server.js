
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const { gradeResume } = require("./scorer");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("resume"), async (req, res) => {
  const fileBuffer = fs.readFileSync(req.file.path);
  const data = await pdfParse(fileBuffer);

  const result = gradeResume(data.text); // score + tips
  res.json(result);
});

app.listen(3001, () => {
  console.log("Server started on http://localhost:3001");
});
