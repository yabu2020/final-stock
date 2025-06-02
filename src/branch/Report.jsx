import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

function Report() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

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
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    axios
      .post("http://localhost:3001/reports", {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        branchManagerId,
      })
      .then(() => {
        alert("Report generated successfully!");
        fetchReports();
      })
      .catch((error) => {
        let errorMessage = "Failed to generate report";
        if (error.response) {
          if (
            error.response.data.error ===
            "No sales data found for the selected date range"
          ) {
            errorMessage = `No sales data found between ${new Date(
              startDate
            ).toLocaleDateString()} and ${new Date(endDate).toLocaleDateString()}`;
            if (error.response.data.counts) {
              errorMessage += `
Found ${error.response.data.counts.orders} orders and ${error.response.data.counts.assignments} assignments`;
            }
          } else {
            errorMessage =
              error.response.data.error ||
              error.response.data.message ||
              errorMessage;
          }
        } else if (error.request) {
          errorMessage = "No response from server. Please check your connection.";
        }
        alert(errorMessage);
      });
  };

  const viewDetails = (report) => {
    setSelectedReport(report);
    setShowDetails(true);
  };

  const sendToAdmin = async (reportId) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/reports/${reportId}/send-to-admin`,
        {
          sentToAdmin: true,
          sentAt: new Date(),
        }
      );
      if (response.data.success) {
        alert("Report sent to admin successfully!");
        fetchReports();
      }
    } catch (error) {
      console.error("Error sending report:", error);
      alert("Failed to send report to admin");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 rounded-lg shadow-lg bg-gray-900">
      <h2 className="text-4xl font-bold text-blue-400 mb-8 text-center">
        Sales Report
      </h2>

      <div className="mb-8 flex justify-center items-center space-x-4">
        <label htmlFor="start-date" className="text-lg font-semibold text-gray-300">
          Start Date:
        </label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="end-date" className="text-lg font-semibold text-gray-300">
          End Date:
        </label>
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

      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-gray-300 mb-4">
          Sales & Profit/Loss Over Time
        </h3>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reports || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="month" stroke="#E5E7EB" />
              <YAxis stroke="#E5E7EB" />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", color: "#E5E7EB" }} />
              <Legend wrapperStyle={{ color: "#E5E7EB" }} />
              <Line type="monotone" dataKey="totalSales" stroke="#4F46E5" strokeWidth={2} name="Total Sales" />
              <Line type="monotone" dataKey="profitOrLoss" stroke="#10B981" strokeWidth={2} name="Profit/Loss" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-gray-300 mb-4">Reports Summary</h3>
        <table className="min-w-full bg-gray-800 shadow-lg rounded-lg">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-gray-300 font-semibold">
                Start Date
              </th>
              <th className="px-4 py-2 text-left text-gray-300 font-semibold">
                End Date
              </th>
              <th className="px-4 py-2 text-left text-gray-300 font-semibold">
                Total Sales
              </th>
              <th className="px-4 py-2 text-left text-gray-300 font-semibold">
                Profit/Loss
              </th>
              <th className="px-4 py-2 text-left text-gray-300 font-semibold">
                Created At
              </th>
              <th className="px-4 py-2 text-left text-gray-300 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <tr key={index} className="border-t border-gray-600">
                  <td className="px-4 py-2 text-gray-300">
                    {new Date(report.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-gray-300">
                    {new Date(report.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-gray-300">
                    ${report.totalSales.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-gray-300">
                    ${report.profitOrLoss.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-gray-300">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-gray-300">
                    <button
                      onClick={() => viewDetails(report)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => sendToAdmin(report._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500 transition"
                      disabled={report.sentToAdmin}
                    >
                      {report.sentToAdmin ? "Sent" : "Send to Admin"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center text-gray-400">
                  No reports available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDetails && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-screen overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-blue-400">
                Product Details:{" "}
                {new Date(selectedReport.startDate).toLocaleDateString()} -{" "}
                {new Date(selectedReport.endDate).toLocaleDateString()}
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-700 p-3 rounded">
                  <p className="text-gray-400">Total Sales</p>
                  <p className="text-xl font-bold text-green-400">
                    ${selectedReport.totalSales?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="bg-gray-700 p-3 rounded">
                  <p className="text-gray-400">Profit/Loss</p>
                  <p
                    className={`text-xl font-bold ${
                      selectedReport.profitOrLoss >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    ${selectedReport.profitOrLoss?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>
            <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">
                    Purchase Price
                  </th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">
                    Sale Price
                  </th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">
                    Total Price
                  </th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">
                    Stock Level
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedReport.reportData?.map((item, index) => {
                  const purchasePrice = item.purchasePrice ?? (item.totalPrice / item.quantity * 0.8);
                  const salePrice = item.salePrice ?? (item.totalPrice / item.quantity);
                  return (
                    <tr key={index} className="border-t border-gray-600">
                      <td className="px-4 py-3 text-gray-300">{item.name || "N/A"}</td>
                      <td className="px-4 py-3 text-gray-300">
                        {item.type ||
                          (item.totalPrice === item.purchasePrice * item.quantity
                            ? "Purchase"
                            : "Sale")}
                      </td>
                      <td className="px-4 py-3 text-gray-300">{item.quantity || 0}</td>
                      <td className="px-4 py-3 text-gray-300">
                        ${purchasePrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        ${salePrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        ${(item.totalPrice || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.status === "Available"
                              ? "bg-green-900 text-green-300"
                              : item.status === "Low Stock"
                              ? "bg-yellow-900 text-yellow-300"
                              : "bg-red-900 text-red-300"
                          }`}
                        >
                          {item.stockLevel || "0"} ({item.status || "N/A"})
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Report;