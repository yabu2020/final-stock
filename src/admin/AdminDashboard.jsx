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

function AdminDashboard() {
  const [statsData, setStatsData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [reportsData, setReportsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const statsResponse = await axios.get("http://localhost:3001/api/stats");
      const { totalUsers, totalEmployees, totalBranches, totalReports } = statsResponse.data;

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
          title: "Reports to Review",
          value: totalReports,
          icon: <i className="fas fa-file-alt"></i>,
          color: "#6f42c1"
        },
      ]);

      const revenueResponse = await axios.get("http://localhost:3001/api/revenue-stats");
      setBarChartData(revenueResponse.data);

      const breakdownResponse = await axios.get("http://localhost:3001/api/user-breakdown");
      setPieChartData(breakdownResponse.data);

      const reportsResponse = await axios.get("http://localhost:3001/api/admin/reports");
      setReportsData(reportsResponse.data);
      
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
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
      setBarChartData([
        { month: "Jan", revenue: 0 },
        { month: "Feb", revenue: 0 },
        { month: "Mar", revenue: 0 },
        { month: "Apr", revenue: 0 },
        { month: "May", revenue: 0 },
        { month: "Jun", revenue: 0 },
        { month: "Jul", revenue: 0 },
        { month: "Aug", revenue: 0 },
        { month: "Sep", revenue: 0 },
        { month: "Oct", revenue: 0 },
        { month: "Nov", revenue: 0 },
        { month: "Dec", revenue: 0 }
      ]);
      setPieChartData([{ name: "No Data", value: 1 }]);
      setReportsData([]);
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
    <div className="bg-gray-900 min-h-screen text-white p-2 sm:p-4">
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg shadow-lg p-3 flex items-center justify-between border-l-4 hover:shadow-xl transition-shadow duration-300 min-w-0"
            style={{ borderColor: stat.color }}
          >
            <div className="truncate">
              <span
                className="text-sm sm:text-base font-bold flex items-center truncate"
                style={{ color: stat.color }}
              >
                {stat.icon && <span className="mr-2">{stat.icon}</span>}
                <span className="truncate">{stat.title}</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold mt-1 truncate">{stat.value}</h2>
            </div>
            <div
              className="hidden sm:flex w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-full items-center justify-center flex-shrink-0 ml-2"
              style={{ borderColor: stat.color }}
            >
              <span className="text-sm sm:text-base font-bold">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg shadow-lg p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-200">
            Revenue by Month
          </h3>
          <div className="h-64 sm:h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="month" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="revenue" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-200">
            User Role Breakdown
          </h3>
          <div className="h-64 sm:h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff", fontSize: "12px" }} />
                <Legend
                  wrapperStyle={{ color: "#fff", fontSize: "12px", paddingTop: "10px" }}
                  layout="horizontal"
                  verticalAlign="bottom"
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
    </div>
  );
}

export default AdminDashboard;