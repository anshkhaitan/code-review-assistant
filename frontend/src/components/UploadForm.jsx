import React, { useState } from "react";

export default function UploadForm() {
  const [files, setFiles] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!files || files.length === 0) return alert("Select at least one file!");

    setLoading(true);
    const fd = new FormData();
    for (const f of files) fd.append("files", f);
    fd.append("projectName", "DemoProject");

    try {
      const res = await fetch("http://localhost:4000/api/reviews/upload", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      setReport(json.report);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Error uploading file!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
        Upload Source Files
      </h2>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className="border border-gray-300 rounded p-2"
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-medium disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Upload & Review"}
        </button>
      </form>

      {report && (
        <div className="mt-8 bg-gray-50 p-4 rounded border border-gray-200">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Summary</h3>
          <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto">
            {JSON.stringify(report.summary, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
