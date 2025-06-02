import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import UserContext from '../admin/UserContext';

const COLORS = {
  primary: "#3b82f6",
  secondary: "#10b981",
  accent: "#f59e0b",
  danger: "#ef4444",
};

function ManagerDashboard() {
  const { cUSer } = useContext(UserContext);
  const [statsData, setStatsData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cUSer?._id) {
      setLoading(false);
      setError("Manager not authenticated");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get("http://localhost:3001/api/manager/stats", {
          params: { managerId: cUSer._id },
        });

        if (!response.data || !response.data.stats) {
          throw new Error("Invalid data format from server");
        }

        const { stats, monthlyEarnings = [] } = response.data;

        const formattedStats = [
          {
            title: "Total Orders",
            value: stats.orders,
            icon: (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            ),
            bgColor: "bg-blue-500/10",
            textColor: "text-blue-400",
          },
          {
            title: "Reports Submitted",
            value: stats.reports,
            icon: (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ),
            bgColor: "bg-emerald-500/10",
            textColor: "text-emerald-400",
          },
        ];

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedLineData = monthlyEarnings.map((item) => ({
          month: monthNames[item.month - 1] || `Month ${item.month}`,
          earnings: item.earnings || 0,
        }));

        setStatsData(formattedStats);
        setLineChartData(formattedLineData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
        setStatsData(getFallbackStats());
        setLineChartData(getFallbackChartData());
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [cUSer]);

  const getFallbackStats = () => [
    {
      title: "Total Orders",
      value: 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      bgColor: "bg-gray-500/10",
      textColor: "text-gray-400",
    },
    {
      title: "Reports Submitted",
      value: 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bgColor: "bg-gray-500/10",
      textColor: "text-gray-400",
    },
  ];

  const getFallbackChartData = () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames.map((month) => ({ month, earnings: 0 }));
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900 text-white items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-500 rounded-full mb-4"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-900 text-white items-center justify-center">
        <div className="text-center p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-auto">
      <div className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 shadow-lg transition-all hover:shadow-xl ${stat.bgColor}`}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor} mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">{stat.title}</h3>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-800 rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <XAxis dataKey="month" stroke="#E5E7EB" tick={{ fill: "#9CA3AF" }} />
                <YAxis
                  stroke="#E5E7EB"
                  tick={{ fill: "#9CA3AF" }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]}
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    borderColor: "#374151",
                    borderRadius: "0.5rem",
                    color: "#FFF",
                  }}
                  itemStyle={{ color: "#FFF" }}
                  labelStyle={{ fontWeight: "bold", color: "#3B82F6" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  activeDot={{
                    r: 8,
                    stroke: COLORS.primary,
                    strokeWidth: 2,
                    fill: "#1E40AF",
                  }}
                  name="Revenue"
                  dot={{
                    r: 4,
                    stroke: COLORS.primary,
                    strokeWidth: 2,
                    fill: "#1E40AF",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;