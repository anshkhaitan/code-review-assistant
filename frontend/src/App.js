import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UploadForm from "./components/UploadForm";
import ReportList from "./components/ReportList";
import ReportDetails from "./components/ReportDetails";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <nav className="bg-indigo-600 text-white px-6 py-4 shadow-md flex justify-between items-center">
          <h1 className="font-semibold text-lg">🧠 Code Review Assistant</h1>
          <div className="space-x-6">
            <Link to="/" className="hover:underline">
              Upload
            </Link>
            <Link to="/reports" className="hover:underline">
              Reports
            </Link>
          </div>
        </nav>

        {/* Main Routes */}
        <main className="p-6">
          <Routes>
            <Route path="/" element={<UploadForm />} />
            <Route path="/reports" element={<ReportList />} />
            <Route path="/reports/:id" element={<ReportDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
