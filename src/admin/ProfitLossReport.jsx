// src/admin/ProfitLossReport.jsx
import { useState, useEffect } from "react";
import axios from "axios";

function ProfitLossReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    period: "monthly",
    startDate: "",
    endDate: ""
  });

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatCurrency = (num, currency = "USD") => {
    if (num == null || isNaN(num)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency
    }).format(num);
  };
  

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (filters.period && filters.period !== "custom") {
        params.period = filters.period;
      } else if (filters.startDate && filters.endDate) {
        params.startDate = filters.startDate;
        params.endDate = filters.endDate;
      }

      const res = await axios.get("/report/profit-loss", { params });

      if (res.data.error) {
        throw new Error(res.data.error);
      }

      // ✅ Safe structure matching backend
      const safeReport = {
        period: {
          start: res.data.period?.start || "—",
          end: res.data.period?.end || "—",
          label: res.data.period?.label || "Report"
        },
        summary: {
          income: parseFloat(res.data.summary?.income) || 0,
          expense: {
            total: parseFloat(res.data.summary?.expense?.total) || 0,
            breakdown: {
              expense: parseFloat(res.data.summary?.expense?.breakdown?.expense) || 0,
              flour: parseFloat(res.data.summary?.expense?.breakdown?.flour) || 0
            }
          },
          profit: parseFloat(res.data.summary?.profit) || 0,
          profitMargin: parseFloat(res.data.summary?.profitMargin) || 0
        },
        details: {
          sales: Array.isArray(res.data.details?.sales) ? res.data.details.sales : [],
          expenses: Array.isArray(res.data.details?.expenses) ? res.data.details.expenses : [],
          flourPurchases: Array.isArray(res.data.details?.flourPurchases) ? res.data.details.flourPurchases : []
        }
      };

      setReport(safeReport);
    } catch (err) {
      console.error("❌ Report error:", err);
      setError("Report Error: " + (err.response?.data?.error || err.message || "Unknown error"));
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loadReport();
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">
            📊 Profit & Loss Report
          </h2>
          
          {/* Filter Form */}
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
            <select
              name="period"
              value={filters.period}
              onChange={handleFilterChange}
              className="px-3 py-1.5 bg-gray-800 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Today</option>
              <option value="monthly">This Month</option>
              <option value="yearly">This Year</option>
              <option value="custom">Custom Range</option>
            </select>

            {filters.period === "custom" && (
              <>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="px-3 py-1.5 bg-gray-800 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="px-3 py-1.5 bg-gray-800 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-70 transition"
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-900/30 border-l-4 border-red-500 text-red-200 p-4 mb-6 rounded">
            <p>⚠️ {error}</p>
          </div>
        )}

        {loading && !report && (
          <div className="text-center py-12 text-gray-400">Generating report...</div>
        )}

        {report && (
          <div className="space-y-8">
            {/* Period Info */}
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                📅 {report.period.label}
              </h3>
              <p className="text-gray-400">
                {report.period.start} to {report.period.end}
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
                <h4 className="text-green-400 text-sm font-medium">Total Income</h4>
                <p className="text-2xl font-bold text-green-300 mt-1">
                  {formatCurrency(report.summary.income)}
                </p>
              </div>

              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                <h4 className="text-red-400 text-sm font-medium">Total Expenses</h4>
                <p className="text-2xl font-bold text-red-300 mt-1">
                  {formatCurrency(report.summary.expense.total)}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  • Expense: {formatCurrency(report.summary.expense.breakdown.expense)}<br/>
                  • Flour: {formatCurrency(report.summary.expense.breakdown.flour)}
                </p>
              </div>

              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                <h4 className="text-blue-400 text-sm font-medium">Net Profit</h4>
                <p className={`text-2xl font-bold mt-1 ${
                  report.summary.profit >= 0 ? "text-green-300" : "text-red-300"
                }`}>
                  {formatCurrency(report.summary.profit)}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Margin: {report.summary.profitMargin}%
                </p>
              </div>
            </div>

            {/* Detailed Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales */}
              <div className="bg-gray-800 rounded-xl shadow border border-gray-700">
                <div className="px-4 py-3 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">
                    💰 Sales ({report.details.sales.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700 text-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs uppercase">Date</th>
                        <th className="px-3 py-2 text-left text-xs uppercase">Bread</th>
                        <th className="px-3 py-2 text-left text-xs uppercase">Qty</th>
                        <th className="px-3 py-2 text-left text-xs uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700 text-gray-300">
                      {report.details.sales.map((s, i) => (
                        <tr key={i} className="hover:bg-gray-700/30">
                          <td className="px-3 py-2 text-sm">{formatDate(s.date)}</td>
                          <td className="px-3 py-2">{s.bread} ({s.size})</td>
                          <td className="px-3 py-2">{s.quantity}</td>
                          <td className="px-3 py-2 font-medium text-green-400">
                            {formatCurrency(s.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Expenses */}
              <div className="bg-gray-800 rounded-xl shadow border border-gray-700">
                <div className="px-4 py-3 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">
                    💸 General Expenses ({report.details.expenses.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700 text-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs uppercase">Date</th>
                        <th className="px-3 py-2 text-left text-xs uppercase">Title</th>
                        <th className="px-3 py-2 text-left text-xs uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700 text-gray-300">
                      {report.details.expenses.map((e, i) => (
                        <tr key={i} className="hover:bg-gray-700/30">
                          <td className="px-3 py-2 text-sm">{formatDate(e.date)}</td>
                          <td className="px-3 py-2">{e.title}</td>
                          <td className="px-3 py-2 font-medium text-red-400">
                            {formatCurrency(e.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Flour Purchases */}
              <div className="bg-gray-800 rounded-xl shadow border border-gray-700 lg:col-span-2">
                <div className="px-4 py-3 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">
                    🛒 Flour Purchases ({report.details.flourPurchases.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700 text-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs uppercase">Date</th>
                        <th className="px-3 py-2 text-left text-xs uppercase">Supplier</th>
                        <th className="px-3 py-2 text-left text-xs uppercase">Qty (Kg)</th>
                        <th className="px-3 py-2 text-left text-xs uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700 text-gray-300">
                      {report.details.flourPurchases.map((fp, i) => (
                        <tr key={i} className="hover:bg-gray-700/30">
                          <td className="px-3 py-2 text-sm">{formatDate(fp.date)}</td>
                          <td className="px-3 py-2">{fp.supplier}</td>
                          <td className="px-3 py-2">{fp.quantityKg} kg</td>
                          <td className="px-3 py-2 font-medium text-green-400">
                            {formatCurrency(fp.totalPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfitLossReport;