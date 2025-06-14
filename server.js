const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');
const cors = require('cors');

const app = express();

// Port ko environment variable se lein, nahi to default 3001 use karein
const port = process.env.PORT || 3001;

app.use(cors());

const upload = multer({ dest: 'uploads/' });

// Resume Scoring Logic
function scoreResume(text) {
  let score = 50; // base score
  const keywords = ['JavaScript', 'Python', 'Node.js', 'React', 'SQL'];
  let keywordCount = 0;

  keywords.forEach(keyword => {
    if (text.toLowerCase().includes(keyword.toLowerCase())) {
      keywordCount++;
    }
  });

  score += keywordCount * 10;

  if (text.toLowerCase().includes('experience')) score += 20;
  if (text.toLowerCase().includes('education')) score += 20;

  return score > 100 ? 100 : score;
}

// Resume Feedback Logic
function generateFeedback(text) {
  let feedback = [];

  if (!text.toLowerCase().includes('experience')) {
    feedback.push("Add an experience section with your previous roles.");
  }
  if (!text.toLowerCase().includes('education')) {
    feedback.push("Include your education details.");
  }

  const keywords = ['JavaScript', 'Python', 'Node.js', 'React', 'SQL'];
  let missingKeywords = keywords.filter(keyword => !text.toLowerCase().includes(keyword.toLowerCase()));
  if (missingKeywords.length > 0) {
    feedback.push("Consider adding relevant keywords like: " + missingKeywords.join(', '));
  }

  if (feedback.length === 0) {
    feedback.push("Great resume! Keep it up.");
  }

  return feedback;
}

// Upload Endpoint
app.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(dataBuffer);
    const text = pdfData.text;
    const score = scoreResume(text);
    const feedback = generateFeedback(text);

    res.json({ score, feedback });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Resume processing failed" });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('✅ Resume Grader Backend Running');
});

// Server start
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
