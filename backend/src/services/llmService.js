const { v4: uuidv4 } = require("uuid");
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

function createPrompt(files, opts = {}) {
  // Keep prompt small in demo: include names + short contents
  const fileBlocks = files
    .map((f) => `### FILE: ${f.filename}\n\`\`\`\n${f.content}\n\`\`\``)
    .join("\n\n");
  const system = `You are an expert code reviewer. Provide a JSON object with keys: summary, files (list, each with issues[]), topSuggestions[], score (0-100). For each issue include severity (info|minor|major|critical), type (bug|security|style|performance), line (if possible), message and suggestion.`;

  const user = `Project: ${opts.projectName}\nAnalyze the following files. Return JSON only.\n\n${fileBlocks}\n\nEnd.`;

  return { system, user };
}

async function analyzeFiles(files, opts) {
  const { system, user } = createPrompt(files, opts);

  const resp = await client.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.0,
    max_tokens: 1000,
  });

  const text =
    resp.choices?.[0]?.message?.content ?? JSON.stringify(resp, null, 2);
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    console.error("Error parsing Gemini response:", text);
    parsed = { summary: { score: 0, topSuggestions: [] }, raw: text };
  }

  const filesReport = files.map((f) => ({
    path: f.filename,
    metrics: {
      lines: f.content.split("\n").length,
      functions: (f.content.match(/function\b|=>/g) || []).length,
    },
    issues: [],
  }));

  return {
    id: uuidv4(),
    meta: {
      projectName: opts.projectName || "project",
      files: files.map((f) => f.filename),
      analyzedAt: new Date().toISOString(),
    },
    summary: parsed.summary || { score: 0, topSuggestions: [] },
    files: parsed.files || filesReport,
    llmAnalysis: {
      model: "gpt-5-thinking-mini",
      rawResponse: text,
      prompt: system + "\n" + user,
    },
  };
}

module.exports = { analyzeFiles };
