import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      const res = await fetch("http://localhost:4000/api/reviews");
      const data = await res.json();
      setReports(data);
      setLoading(false);
    }
    fetchReports();
  }, []);

  if (loading) return <p className="text-center mt-6">Loading reports...</p>;
  if (!reports.length)
    return <p className="text-center mt-6 text-gray-600">No reports yet.</p>;

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-700">All Reports</h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3">Project</th>
              <th className="p-3">Score</th>
              <th className="p-3">Created</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr
                key={r.id}
                className="border-b hover:bg-indigo-50 transition duration-150"
              >
                <td className="p-3 font-medium">{r.projectName}</td>
                <td className="p-3">{r.score}</td>
                <td className="p-3">
                  {new Date(r.createdAt).toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  <Link
                    to={`/reports/${r.id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
