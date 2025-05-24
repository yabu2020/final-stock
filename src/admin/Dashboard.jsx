import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

function Dashboard() {
  const [statsData, setStatsData] = useState([]);
  const [barChartData, setBarChartData] = useState([
    { month: "Jan", revenue: 65 },
    { month: "Feb", revenue: 59 },
    { month: "Mar", revenue: 80 },
    { month: "Apr", revenue: 81 },
    { month: "May", revenue: 56 },
    { month: "Jun", revenue: 55 },
    { month: "Jul", revenue: 40 },
  ]);
  const [pieChartData, setPieChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/stats");

      const { totalUsers, totalEmployees, totalBranches, totalReports } = response.data;

      setStatsData([
        {
          title: "Total Users",
          value: totalUsers,
          icon: <i className="fas fa-users"></i>,
          color: "#007bff"
        },
        {
          title: "Total Employees",
          value: totalEmployees,
          icon: <i className="fas fa-user-tie"></i>,
          color: "#28a745"
        },
        {
          title: "Total Branches",
          value: totalBranches,
          icon: <i className="fas fa-building"></i>,
          color: "#17a2b8"
        },
        {
          title: "Total Reports",
          value: totalReports,
          icon: <i className="fas fa-file-alt"></i>,
          color: "#6f42c1"
        },
      ]);

      const breakdownResponse = await axios.get("http://localhost:3001/api/user-breakdown");
      setPieChartData(breakdownResponse.data);
      
    } catch (err) {
      console.error("Error fetching stats:", err);

      // Fallback static data
      setStatsData([
        {
          title: "Total Users",
          value: 0,
          icon: <i className="fas fa-users"></i>,
          color: "#007bff"
        },
        {
          title: "Total Employees",
          value: 0,
          icon: <i className="fas fa-user-tie"></i>,
          color: "#28a745"
        },
        {
          title: "Total Branches",
          value: 0,
          icon: <i className="fas fa-building"></i>,
          color: "#17a2b8"
        },
        {
          title: "Total Reports",
          value: 0,
          icon: <i className="fas fa-file-alt"></i>,
          color: "#6f42c1"
        },
      ]);

      setPieChartData([{ name: "No Data", value: 1 }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg shadow-lg p-4 flex items-center justify-between border-l-4 hover:shadow-xl transition-shadow duration-300"
            style={{ borderColor: stat.color }}
          >
            <div>
              <span
                className="text-xl font-bold flex items-center"
                style={{ color: stat.color }}
              >
                {stat.icon && <span className="mr-2">{stat.icon}</span>}
                {stat.title}
              </span>
              <h2 className="text-2xl font-semibold mt-1">{stat.value}</h2>
            </div>
            <div
              className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center"
              style={{ borderColor: stat.color }}
            >
              <span className="text-xl font-bold">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Monthly Revenue - Bar Chart */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">Revenue by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff" }} />
              <Legend />
              <Bar dataKey="revenue" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Role Breakdown - Pie Chart */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">User Role Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff" }} />
              <Legend
                wrapperStyle={{ color: "#fff", top: "85%" }}
                payload={pieChartData.map((entry, idx) => ({
                  id: entry.name,
                  type: "square",
                  value: entry.name,
                  color: COLORS[idx % COLORS.length],
                }))}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;