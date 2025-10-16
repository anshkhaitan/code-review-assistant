import React, { useState } from "react";
import "./App.css";

function App() {
  const [files, setFiles] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!files || files.length === 0) return alert("Choose files");
    setLoading(true);
    const fd = new FormData();
    for (const f of files) fd.append("files", f);
    fd.append("projectName", "DemoProject");

    const res = await fetch("http://localhost:4000/api/reviews/upload", {
      method: "POST",
      body: fd,
    });
    const json = await res.json();
    setReport(json.report);
    setLoading(false);
  }

  return (
    <div className="App" style={{ padding: 20 }}>
      <h2>Code Review Assistant — Demo</h2>
      <form onSubmit={submit}>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />
        <button type="submit" style={{ marginLeft: 8 }}>
          Upload & Review
        </button>
      </form>

      {loading && <p>Analyzing…</p>}
      {report && (
        <div style={{ marginTop: 20, textAlign: "left" }}>
          <h3>Summary</h3>
          <pre>{JSON.stringify(report.summary, null, 2)}</pre>
          <h3>Files</h3>
          <pre>{JSON.stringify(report.files, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
