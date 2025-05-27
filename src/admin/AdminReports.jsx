import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/admin/reports');
      setReports(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-8">Branch Reports</h1>
        <div className="text-center py-8">Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-8">Branch Reports</h1>
        <div className="text-red-500 text-center py-8">{error}</div>
        <button 
          onClick={fetchReports}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8">Branch Reports</h1>
      
      {reports.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No reports have been submitted by branch managers yet.
        </div>
      ) : (
        <>
          <table className="min-w-full bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            {/* <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Product</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Type</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Quantity</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Purchase Price</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Sale Price</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Total Price</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Stock Level</th>
              </tr>
            </thead> */}
            <tbody>
              {reports.map(report => (
                <tr key={report._id} className="border-t border-gray-600">
                  {/* ... existing table cells ... */}
                  <td className="px-4 py-2">
                    <button 
                      onClick={() => setSelectedReport(report)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal for report details */}
          {selectedReport && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    Report from {selectedReport.branchManagerId?.name || 'Unknown Manager'}
                  </h2>
                  <button 
                    onClick={() => setSelectedReport(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-700 p-4 rounded">
                    <p className="text-gray-400">Period</p>
                    <p className="font-medium text-white">
                      {new Date(selectedReport.startDate).toLocaleDateString()} - 
                      {new Date(selectedReport.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded">
                    <p className="text-gray-400">Submitted On</p>
                    <p className="font-medium text-white">
                      {new Date(selectedReport.sentAt || selectedReport.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
                  <thead className="bg-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-300 font-semibold">Product</th>
                      <th className="px-4 py-3 text-left text-gray-300 font-semibold">Type</th>
                      <th className="px-4 py-3 text-left text-gray-300 font-semibold">Quantity</th>
                      <th className="px-4 py-3 text-left text-gray-300 font-semibold">Purchase Price</th>
                      <th className="px-4 py-3 text-left text-gray-300 font-semibold">Sale Price</th>
                      <th className="px-4 py-3 text-left text-gray-300 font-semibold">Total Price</th>
                      <th className="px-4 py-3 text-left text-gray-300 font-semibold">Date</th>
                      <th className="px-4 py-3 text-left text-gray-300 font-semibold">Stock Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReport.reportData?.map((item, index) => {
                      // Calculate prices with fallbacks
                      const purchasePrice = item.purchasePrice ?? 
                                          (item.totalPrice / item.quantity * 0.8); // Fallback: 80% of sale price
                      const salePrice = item.salePrice ?? 
                                       (item.totalPrice / item.quantity);
                      
                      return (
                        <tr key={index} className="border-t border-gray-600">
                          <td className="px-4 py-3 text-gray-300">{item.name || 'N/A'}</td>
                          <td className="px-4 py-3 text-gray-300">
                            {item.type || (item.totalPrice === item.purchasePrice * item.quantity ? 'Purchase' : 'Sale')}
                          </td>
                          <td className="px-4 py-3 text-gray-300">{item.quantity || 0}</td>
                          <td className="px-4 py-3 text-gray-300">${purchasePrice.toFixed(2)}</td>
                          <td className="px-4 py-3 text-gray-300">${salePrice.toFixed(2)}</td>
                          <td className="px-4 py-3 text-gray-300">${(item.totalPrice || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-gray-300">
                            {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-gray-300">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.status === 'Available' ? 'bg-green-900 text-green-300' :
                              item.status === 'Low Stock' ? 'bg-yellow-900 text-yellow-300' :
                              'bg-red-900 text-red-300'
                            }`}>
                              {item.stockLevel || '0'} ({item.status || 'N/A'})
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedReport(null)} // Close the modal by setting selectedReport to null
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminReports;