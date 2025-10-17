import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ReportDetails() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      const res = await fetch(`http://localhost:4000/api/reviews/${id}`);
      const data = await res.json();
      setReport(data);
      setLoading(false);
    }
    fetchReport();
  }, [id]);

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!report) return <p className="text-center mt-6 text-red-600">Report not found.</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-2 text-indigo-700">
        {report.projectName}
      </h2>
      <p className="mb-4 text-gray-600">Score: {report.score}</p>

      <h3 className="text-lg font-semibold mb-2">Top Suggestions</h3>
      <ul className="list-disc ml-6 mb-4">
        {report.topSuggestions?.map((s, i) => (
          <li key={i} className="text-gray-700">
            {s}
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold mb-2">Full Report</h3>
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
        {JSON.stringify(report.reportJson, null, 2)}
      </pre>

      <div className="mt-4">
        <Link
          to="/reports"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          ← Back
        </Link>
      </div>
    </div>
  );
}
