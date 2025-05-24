import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

// Sample data
const statsData = [
  {
    title: "Orders",
    value: 236,
    change: "+18.33%",
  },
  {
    title: "Total Products",
    value: "$18,306",
    change: "-10.5%",
  },
  {
    title: "Most sold product",
    value: 1538,
    change: "+20%",
  },
  {
    title: "Report",
    value: 864,
    change: "+5%",
  },
];

const pieChartData = [
  { name: "Direct Sales", value: 2346, color: "#90cdf4" },    // soft blue
  { name: "Referral Sales", value: 2108, color: "#fbb6ce" },  // soft pink
  { name: "Affiliate Sales", value: 1204, color: "#fcd34d" }, // soft yellow
];


const barChartData = [
  { month: "Jan", earnings: 5 },
  { month: "Feb", earnings: 4 },
  { month: "Mar", earnings: 6 },
  { month: "Apr", earnings: 5.5 },
  { month: "May", earnings: 9 },
  { month: "Jun", earnings: 7 },
];

const mainColor = "#3b82f6"; // Tailwind blue-500

function DashBoard() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-grow p-4">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800 text-white rounded-lg shadow p-4 flex items-center justify-between"
            >
              <div>
                <span className="text-xl font-bold">{stat.title}</span>
                <p className="text-sm">
                  {stat.value} <small>{stat.change}</small>
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pie Chart */}
          <div className="bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Total Sales</h3>
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
        <Cell key={`cell-${index}`} fill={entry.color} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>

          </div>

          {/* Bar Chart */}
          <div className="bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Net Income</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="earnings" fill={mainColor} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-gray-800 rounded-lg shadow p-4 mt-4">
          <h3 className="text-lg font-semibold mb-4">Earning Statistics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={barChartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="earnings" stroke={mainColor} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
