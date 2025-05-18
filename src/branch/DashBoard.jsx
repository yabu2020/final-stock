


// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";
// import { PieChart, Pie, Cell } from "recharts";
// import { ResponsiveContainer } from "recharts";

// // Sample data
// const statsData = [
//   {
//     title: "New Clients",
//     value: 236,
//     change: "+18.33%",
//     color: "#007bff", // Blue
//   },
//   {
//     title: "Earnings of Month",
//     value: "$18,306",
//     change: "-10.5%",
//     color: "#dc3545", // Red
//   },
//   {
//     title: "New Projects",
//     value: 1538,
//     change: "+20%",
//     color: "#ffc107", // Yellow
//   },
//   {
//     title: "Projects",
//     value: 864,
//     change: "+5%",
//     color: "#28a745", // Green
//   },
// ];

// const pieChartData = [
//   { name: "Direct Sales", value: 2346, color: "#007bff" }, // Blue
//   { name: "Referral Sales", value: 2108, color: "#dc3545" }, // Red
//   { name: "Affiliate Sales", value: 1204, color: "#ffc107" }, // Yellow
// ];

// const barChartData = [
//   { month: "Jan", earnings: 5 },
//   { month: "Feb", earnings: 4 },
//   { month: "Mar", earnings: 6 },
//   { month: "Apr", earnings: 5.5 },
//   { month: "May", earnings: 9 },
//   { month: "Jun", earnings: 7 },
// ];

// const worldMapData = [
//   { country: "India", value: 28 },
//   { country: "UK", value: 21 },
//   { country: "USA", value: 18 },
//   { country: "China", value: 12 },
// ];

// const activityData = [
//   {
//     icon: <i className="fas fa-shopping-cart text-red-500"></i>,
//     message: "New Product Sold!",
//     details: "John Musa just purchased Cannon 5M Camera.",
//     time: "10 Minutes Ago",
//   },
//   {
//     icon: <i className="fas fa-ticket-alt text-red-500"></i>,
//     message: "New Support Ticket",
//     details: "Richardson just created support ticket",
//     time: "5 Minutes Ago",
//   },
// ];

// const COLORS = ["#007bff", "#dc3545", "#ffc107"];

// function DashBoard() {
//   return (
//     <div className="flex h-screen bg-gray-900 text-white">
//       {/* Main Content Area */}
//       <div className="flex-grow p-4">
//         {/* Welcome Message */}
//         <div className="bg-gray-800 rounded-lg shadow p-4 mb-4">
//           <h2 className="text-2xl font-semibold mb-2">Good Morning Jason!</h2>
//           <p className="text-sm">Dashboard</p>
//         </div>

//         {/* Statistics Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//           {statsData.map((stat, index) => (
//             <div
//               key={index}
//               className={`bg-${stat.color}-500 text-white rounded-lg shadow p-4 flex items-center justify-between`}
//             >
//               <div>
//                 <span className="text-xl font-bold">{stat.title}</span>
//                 <p className="text-sm">
//                   {stat.value} <small>{stat.change}</small>
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
//                 <span className="text-xl font-bold">{stat.value}</span>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {/* Pie Chart - Total Sales */}
//           <div className="bg-gray-800 rounded-lg shadow p-4">
//             <h3 className="text-lg font-semibold mb-4">Total Sales</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={pieChartData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {pieChartData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="mt-4">
//               {pieChartData.map((entry, index) => (
//                 <div key={index} className="flex items-center mb-2">
//                   <div
//                     className="w-4 h-4 mr-2"
//                     style={{ backgroundColor: entry.color }}
//                   ></div>
//                   <span className="mr-2">{entry.name}</span>
//                   <span>${entry.value}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Bar Chart - Net Income */}
//           <div className="bg-gray-800 rounded-lg shadow p-4">
//             <h3 className="text-lg font-semibold mb-4">Net Income</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={barChartData}>
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="earnings" fill="#007bff" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* World Map - Earning by Location */}
//           <div className="bg-gray-800 rounded-lg shadow p-4">
//             <h3 className="text-lg font-semibold mb-4">Earning by Location</h3>
//             <img
//               src="/world-map.png" // Replace with your world map image
//               alt="World Map"
//               className="w-full h-64 object-cover"
//             />
//             <div className="mt-4">
//               {worldMapData.map((entry, index) => (
//                 <div key={index} className="flex items-center mb-2">
//                   <div
//                     className="w-4 h-4 mr-2"
//                     style={{ backgroundColor: COLORS[index % COLORS.length] }}
//                   ></div>
//                   <span className="mr-2">{entry.country}</span>
//                   <span>{entry.value}%</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Line Chart - Earning Statistics */}
//         <div className="bg-gray-800 rounded-lg shadow p-4 mb-4">
//           <h3 className="text-lg font-semibold mb-4">Earning Statistics</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={barChartData}>
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="earnings" stroke="#007bff" activeDot={{ r: 8 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Recent Activity */}
//         <div className="bg-gray-800 rounded-lg shadow p-4">
//           <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
//           <ul>
//             {activityData.map((activity, index) => (
//               <li key={index} className="flex items-center mb-2">
//                 <div
//                   className="w-6 h-6 mr-2"
//                 >
//                   {activity.icon}
//                 </div>
//                 <div>
//                   <p className="font-bold">{activity.message}</p>
//                   <p className="text-sm text-gray-400">{activity.details}</p>
//                   <p className="text-xs text-gray-400">{activity.time}</p>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DashBoard;

import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

// Sample data for statistics cards
const statsData = [
  {
    title: "Customers",
    value: "36,254",
    change: "+5.27%",
    color: "#007bff", // Blue
  },
  {
    title: "Orders",
    value: "5,543",
    change: "+1.08%",
    color: "#dc3545", // Red
  },
  {
    title: "Revenue",
    value: "$6.254",
    change: "+7.09%",
    color: "#ffc107", // Yellow
  },
  {
    title: "Growth",
    value: "+30.56%",
    change: "+4.67%",
    color: "#28a745", // Green
  },
];

// Sample data for bar chart (Projections vs Actuals)
const barChartData = [
  { month: "Jan", actual: 100, projection: 120 },
  { month: "Feb", actual: 110, projection: 130 },
  { month: "Mar", actual: 120, projection: 140 },
  { month: "Apr", actual: 130, projection: 150 },
  { month: "May", actual: 140, projection: 160 },
  { month: "Jun", actual: 150, projection: 170 },
  { month: "Jul", actual: 160, projection: 180 },
  { month: "Aug", actual: 170, projection: 190 },
  { month: "Sep", actual: 180, projection: 200 },
  { month: "Oct", actual: 190, projection: 210 },
  { month: "Nov", actual: 200, projection: 220 },
  { month: "Dec", actual: 210, projection: 230 },
];

// Sample data for line chart (Revenue)
const lineChartData = [
  { week: "Current Week", revenue: 58254 },
  { week: "Previous Week", revenue: 69524 },
];

// Sample data for world map
const worldMapData = [
  { country: "India", value: 28 },
  { country: "USA", value: 21 },
  { country: "China", value: 18 },
  { country: "UK", value: 12 },
];

const COLORS = ["#007bff", "#dc3545", "#ffc107", "#28a745"];

function DashBoard() {
  return (
    <div className="bg-gray-900 min-h-screen p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div>
          <input
            type="text"
            placeholder="Search..."
            className="border rounded px-2 py-1 bg-gray-800 text-white"
          />
          <button className="bg-blue-500 text-white px-4 py-2 ml-2 rounded">
            Search
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className={`bg-${stat.color}-500 text-white rounded-lg shadow p-4 flex items-center justify-between`}
          >
            <div>
              <span className="text-xl font-bold">{stat.title}</span>
              <p className="text-sm">
                {stat.value} <small>{stat.change}</small>
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Projections vs Actuals */}
        <div className="bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4 text-white">Projections vs Actuals</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="actual" fill="#007bff" name="Actual" />
              <Bar dataKey="projection" fill="#dc3545" name="Projection" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue */}
        <div className="bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4 text-white">Revenue</h3>
          <div className="flex justify-between">
            <div>
              <p className="text-xl font-bold text-white">Current Week</p>
              <p className="text-sm text-gray-400">Today's Earning: $2,562.30</p>
              <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
                View Statements
              </button>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Previous Week</p>
              <p className="text-sm text-gray-400">Total Earnings: $69,524</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineChartData}>
              <XAxis dataKey="week" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#007bff" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* World Map */}
        <div className="bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4 text-white">Revenue by Location</h3>
          <img
            src="/world-map.png" // Replace with your world map image
            alt="World Map"
            className="w-full h-64 object-cover"
          />
          <div className="mt-4">
            {worldMapData.map((entry, index) => (
              <div key={index} className="flex items-center mb-2">
                <div
                  className="w-4 h-4 mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="mr-2 text-white">{entry.country}</span>
                <span className="text-white">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;









// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
// } from "recharts";

// // Sample data for statistics cards
// const statsData = [
//   {
//     title: "Total Earnings",
//     value: "$30,200",
//     color: "#FF5733", // Orange
//   },
//   {
//     title: "Page Views",
//     value: "290+",
//     color: "#28A745", // Green
//   },
//   {
//     title: "Task Completed",
//     value: "145",
//     color: "#DC3545", // Red
//   },
//   {
//     title: "Downloads",
//     value: "500",
//     color: "#007BFF", // Blue
//   },
// ];

// // Sample data for line chart
// const lineChartData = [
//   { year: "2015", value: 300 },
//   { year: "2016", value: 400 },
//   { year: "2017", value: 350 },
//   { year: "2018", value: 500 },
//   { year: "2019", value: 450 },
//   { year: "2020", value: 550 },
//   { year: "2021", value: 600 },
// ];

// // Sample data for application sales
// const appSalesData = [
//   {
//     name: "Application",
//     sales: 16300,
//     change: "+10%",
//     avgPrice: "$53",
//     total: "$15,652",
//   },
//   {
//     name: "Photoshop",
//     sales: 26421,
//     change: "-5%",
//     avgPrice: "$35",
//     total: "$18,785",
//   },
//   {
//     name: "Guruable",
//     sales: 8265,
//     change: "+2%",
//     avgPrice: "$98",
//     total: "$9,652",
//   },
//   {
//     name: "Flatable",
//     sales: 10652,
//     change: "+3%",
//     avgPrice: "$20",
//     total: "$7,856",
//   },
// ];

// // Sample data for project risk
// const projectRiskData = [
//   { name: "Project Risk", value: 5 },
// ];

// const COLORS = ["#FF5733", "#28A745", "#DC3545", "#007BFF"];

// function DashBoard() {
//   return (
//     <div className="flex h-screen bg-gray-900 text-white">
//       {/* Main Content Area */}
//       <div className="flex-grow p-4">
//         {/* Statistics Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//           {statsData.map((stat, index) => (
//             <div
//               key={index}
//               className={`bg-${stat.color}-500 text-white rounded-lg shadow p-4 flex items-center justify-between`}
//             >
//               <div>
//                 <span className="text-xl font-bold">{stat.title}</span>
//                 <p className="text-sm">{stat.value}</p>
//               </div>
//               <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
//                 <span className="text-xl font-bold">{stat.value}</span>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Line Chart */}
//         <div className="bg-gray-800 rounded-lg shadow p-4 mb-4">
//           <h3 className="text-lg font-semibold mb-4">Sales Analytics</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={lineChartData}>
//               <XAxis dataKey="year" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="value" stroke="#FF5733" activeDot={{ r: 8 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Application Sales Table */}
//         <div className="bg-gray-800 rounded-lg shadow p-4 mb-4">
//           <h3 className="text-lg font-semibold mb-4">Application Sales</h3>
//           <table className="min-w-full">
//             <thead>
//               <tr>
//                 <th className="px-4 py-2">Application</th>
//                 <th className="px-4 py-2">Sales</th>
//                 <th className="px-4 py-2">Change</th>
//                 <th className="px-4 py-2">Avg Price</th>
//                 <th className="px-4 py-2">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {appSalesData.map((app, index) => (
//                 <tr key={index}>
//                   <td className="px-4 py-2">{app.name}</td>
//                   <td className="px-4 py-2">{app.sales}</td>
//                   <td className="px-4 py-2">{app.change}</td>
//                   <td className="px-4 py-2">{app.avgPrice}</td>
//                   <td className="px-4 py-2">{app.total}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Project Risk */}
//         <div className="bg-gray-800 rounded-lg shadow p-4 mb-4">
//           <h3 className="text-lg font-semibold mb-4">Project Risk</h3>
//           <ResponsiveContainer width="100%" height={200}>
//             <PieChart>
//               <Pie
//                 data={projectRiskData}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 outerRadius={80}
//                 fill="#FF5733"
//                 dataKey="value"
//               >
//                 {projectRiskData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//           <button className="bg-orange-500 text-white px-4 py-2 mt-4 rounded">
//             Download Overall Report
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DashBoard;