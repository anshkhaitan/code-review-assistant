// backend/src/services/llmService.js
const { v4: uuidv4 } = require("uuid");
const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Auto-select provider
const isGemini = !!process.env.GEMINI_API_KEY;

// Initialize clients
const openai = !isGemini
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;
const gemini = isGemini
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

function createPrompt(files, opts = {}) {
  const fileSummaries = files
    .map((f) => `### FILE: ${f.filename}\n\`\`\`\n${f.content}\n\`\`\`\n`)
    .join("\n\n");

  const prompt = `
You are a code review assistant.
Analyze this code for readability, modularity, bugs, and best practices.
Return ONLY valid JSON in this format:

{
  "summary": {
    "score": <0-100>,
    "topSuggestions": [ "..." ]
  },
  "files": [
    {
      "path": "filename",
      "metrics": { "lines": <number>, "functions": <number> },
      "issues": [
        { "severity": "minor|major|critical", "type": "bug|style|security", "message": "short message", "suggestion": "how to fix" }
      ]
    }
  ]
}
If no issues, still return valid JSON with a neutral score (50).
`;

  const user = `Project: ${opts.projectName || "project"}\n\n${fileSummaries}`;
  return { prompt, user };
}

async function analyzeFiles(files = [], opts = {}) {
  const { prompt, user } = createPrompt(files, opts);
  let text = "";

  console.log(`🧠 Analyzing with model: ${isGemini ? "Gemini" : "OpenAI"}`);

  try {
    if (isGemini) {
      // ✅ Gemini API
      const model = gemini.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
      });
      const result = await model.generateContent(`${prompt}\n${user}`);
      text = result.response.text();
    } else {
      // ✅ OpenAI API
      const resp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: user },
        ],
        temperature: 0.2,
      });
      text = resp.choices?.[0]?.message?.content || "";
    }
  } catch (err) {
    console.error("❌ LLM API Error:", err.message);
    return {
      id: uuidv4(),
      summary: { score: 0, topSuggestions: ["LLM API error: " + err.message] },
      files: [],
    };
  }

  // ✅ Try to extract JSON from model output
  let parsed;
  try {
    const match = text.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(match ? match[0] : text);
  } catch {
    console.error("⚠️ JSON parse failed. Raw output:\n", text);
    parsed = {
      summary: { score: 0, topSuggestions: ["Invalid JSON output."] },
      files: [],
    };
  }

  // ✅ Add fallback metrics
  const filesReport =
    parsed.files?.length > 0
      ? parsed.files
      : files.map((f) => ({
          path: f.filename,
          metrics: {
            lines: f.content.split("\n").length,
            functions: (f.content.match(/function\b|=>/g) || []).length,
          },
          issues: [],
        }));

  // ✅ Add fallback score
  if (!parsed.summary?.score || parsed.summary.score === 0) {
    const totalIssues =
      filesReport.reduce((sum, f) => sum + (f.issues?.length || 0), 0) || 0;
    parsed.summary.score = Math.max(100 - totalIssues * 10, 50);
  }

  return {
    id: uuidv4(),
    meta: {
      projectName: opts.projectName || "uploaded-project",
      files: files.map((f) => f.filename),
      analyzedAt: new Date().toISOString(),
    },
    summary: parsed.summary,
    files: filesReport,
    llmAnalysis: {
      model: isGemini ? "gemini-1.5-flash" : "gpt-4o-mini",
      rawResponse: text,
    },
  };
}

module.exports = { analyzeFiles };
