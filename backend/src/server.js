require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const { analyzeFiles } = require("./services/llmService");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
    const report = await analyzeFiles(files, { projectName });

    await prisma.review.create({
      data: {
        projectName: report.meta.projectName,
        score: report.summary.score,
        topSuggestions: JSON.stringify(report.summary.topSuggestions),
        reportJson: JSON.stringify(report),
      },
    });

    // Send response back to frontend
    res.json({ reviewId: report.id, status: "done", report });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "upload_failed", details: String(err) });
  }
});

app.get("/api/ping", (req, res) => res.json({ pong: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));

// 🧠 Fetch all saved reviews
app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        projectName: true,
        score: true,
        topSuggestions: true,
        createdAt: true,
      },
    });

    // Parse topSuggestions back into an array for the frontend
    const formatted = reviews.map((r) => ({
      ...r,
      topSuggestions: JSON.parse(r.topSuggestions || "[]"),
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Error fetching all reviews:", err);
    res.status(500).json({ error: "failed_to_fetch_reviews" });
  }
});

// 🧠 Fetch a single review by ID
app.get("/api/reviews/:id", async (req, res) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: req.params.id },
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Parse JSON fields before sending
    const formatted = {
      ...review,
      topSuggestions: JSON.parse(review.topSuggestions || "[]"),
      reportJson: JSON.parse(review.reportJson || "{}"),
    };

    res.json(formatted);
  } catch (err) {
    console.error("❌ Error fetching review:", err);
    res.status(500).json({ error: "failed_to_fetch_review" });
  }
});
