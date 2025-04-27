import React, { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import axios from "axios";

function Report() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const branchManagerId = currentUser?._id;

    if (!branchManagerId) {
      alert("You must be logged in as a branch manager to view reports.");
      return;
    }

    axios
      .get("http://localhost:3001/reports", { params: { branchManagerId } })
      .then((response) => {
        console.log("Fetched reports:", response.data);
        setReports(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
      });
  };

  const generateReport = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const branchManagerId = currentUser?._id;

    if (!branchManagerId) {
      alert("You must be logged in as a branch manager to generate reports.");
      return;
    }

    axios
      .post("http://localhost:3001/reports", { startDate, endDate, branchManagerId })
      .then(() => {
        alert("Report generated successfully!");
        fetchReports();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          alert(error.response.data.error || "Failed to generate report");
        } else {
          console.error("Error generating report:", error);
          alert("Failed to generate report");
        }
      });
  };

  return (
    <div className="max-w-5xl mx-auto p-8 rounded-lg shadow-lg bg-gray-900">
      <h2 className="text-4xl font-bold text-blue-400 mb-8 text-center">Sales Report</h2>

      {/* Date Range Selector */}
      <div className="mb-8 flex justify-center items-center space-x-4">
        <label htmlFor="start-date" className="text-lg font-semibold text-gray-300">Start Date:</label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="end-date" className="text-lg font-semibold text-gray-300">End Date:</label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={generateReport}
          className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-500 transition duration-300"
        >
          Generate Report
        </button>
      </div>

      {/* Sales & Profit/Loss Graph */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-gray-300 mb-4">Sales & Profit/Loss Over Time</h3>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reports || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="month" stroke="#E5E7EB" />
              <YAxis stroke="#E5E7EB" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#E5E7EB' }} />
              <Legend wrapperStyle={{ color: '#E5E7EB' }} />
              <Line type="monotone" dataKey="totalSales" stroke="#4F46E5" strokeWidth={2} name="Total Sales" />
              <Line type="monotone" dataKey="profitOrLoss" stroke="#10B981" strokeWidth={2} name="Profit/Loss" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reports Table */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-300 mb-4">Detailed Reports</h3>
        <table className="min-w-full bg-gray-800 shadow-lg rounded-lg">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-gray-300 font-semibold">Start Date</th>
              <th className="px-4 py-2 text-left text-gray-300 font-semibold">End Date</th>
              <th className="px-4 py-2 text-left text-gray-300 font-semibold">Total Sales</th>
              <th className="px-4 py-2 text-left text-gray-300 font-semibold">Profit/Loss</th>
              <th className="px-4 py-2 text-left text-gray-300 font-semibold">Created At</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <tr key={index} className="border-t border-gray-600">
                  <td className="px-4 py-2 text-gray-300">{new Date(report.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-gray-300">{new Date(report.endDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-gray-300">${report.totalSales.toFixed(2)}</td>
                  <td className="px-4 py-2 text-gray-300">${report.profitOrLoss.toFixed(2)}</td>
                  <td className="px-4 py-2 text-gray-300">{new Date(report.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center text-gray-400">No reports available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Report;