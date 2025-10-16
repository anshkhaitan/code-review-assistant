require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const { analyzeFiles } = require("./services/llmService");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: path.join(__dirname, "..", "uploads") });
// Upload multiple files
app.post("/api/reviews/upload", upload.array("files"), async (req, res) => {
  try {
    const uploaded = req.files || [];
    const files = [];
    for (const f of uploaded) {
      const content = await fs.readFile(f.path, "utf8");
      files.push({ filename: f.originalname, content });
      await fs.unlink(f.path).catch(() => {});
    }

    const projectName = req.body.projectName || "uploaded-project";
    // Call the LLM-based analyzer synchronously for demo
    const report = await analyzeFiles(files, { projectName });

    // for simplicity, return report directly
    res.json({ reviewId: report.id, status: "done", report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "upload_failed", details: String(err) });
  }
});

app.get("/api/ping", (req, res) => res.json({ pong: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
