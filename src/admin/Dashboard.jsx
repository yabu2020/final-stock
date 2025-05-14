import React from "react";
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

// Sample data for statistics cards
const statsData = [
  {
    title: "Total Users",
    value: 127,
    icon: <i className="fas fa-users" />,
    color: "#007bff", // Blue
  },
  {
    title: "Pending Tasks",
    value: 30,
    icon: <i className="fas fa-tasks" />,
    color: "#dc3545", // Red
  },
  {
    title: "Meetings",
    value: 42,
    icon: <i className="fas fa-calendar-alt" />,
    color: "#ffc107", // Yellow
  },
  {
    title: "Orders",
    value: 900,
    icon: <i className="fas fa-shopping-cart" />,
    color: "#28a745", // Green
  },
];

// Sample data for bar chart
const barChartData = [
  { month: "Jan", revenue: 65 },
  { month: "Feb", revenue: 59 },
  { month: "Mar", revenue: 80 },
  { month: "Apr", revenue: 81 },
  { month: "May", revenue: 56 },
  { month: "Jun", revenue: 55 },
  { month: "Jul", revenue: 40 },
];

// Sample data for pie chart
const pieChartData = [
  { name: "Users", value: 400 },
  { name: "Tasks", value: 300 },
  { name: "Orders", value: 300 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

function Dashboard() {
  return (
    <div className="p-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
          >
            <div>
              <span
                className="text-xl font-bold text-gray-800"
                style={{ color: stat.color }}
              >
                {stat.icon} {stat.title}
              </span>
              <h2 className="text-2xl font-semibold text-gray-800 mt-1">
                {stat.value}
              </h2>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-gray-800">
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Revenue by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Data Breakdown</h3>
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
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;