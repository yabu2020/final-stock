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
      <div className="max-w-7xl mx-auto p-4 sm:p-8 bg-gray-900 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Branch Reports</h1>
        <div className="text-center py-8">Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-8 bg-gray-900 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Branch Reports</h1>
        <div className="text-red-500 text-center py-8">{error}</div>
        <div className="text-center">
          <button 
            onClick={fetchReports}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 bg-gray-900 text-white">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Branch Reports</h1>
      
      {reports.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No reports have been submitted by branch managers yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <tbody>
              {reports.map(report => (
                <tr key={report._id} className="border-t border-gray-600">
                  <td className="px-4 py-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div>
                        <p className="font-medium">{report.branchManagerId?.name || 'Unknown Manager'}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button 
                        onClick={() => setSelectedReport(report)}
                        className="sm:ml-auto px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

{selectedReport && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Report from {selectedReport.branchManagerId?.name || 'Unknown Manager'}
        </h2>
        <button 
          onClick={() => setSelectedReport(null)}
          className="text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>
      </div>
      
      {/* Add this profit/loss summary section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700 p-3 sm:p-4 rounded">
          <p className="text-gray-400 text-sm sm:text-base">Period</p>
          <p className="font-medium text-white text-sm sm:text-base">
            {new Date(selectedReport.startDate).toLocaleDateString()} - 
            {new Date(selectedReport.endDate).toLocaleDateString()}
          </p>
        </div>
        <div className="bg-gray-700 p-3 sm:p-4 rounded">
                <p className="text-gray-400 text-sm sm:text-base">Submitted On</p>
                <p className="font-medium text-white text-sm sm:text-base">
                  {new Date(selectedReport.sentAt || selectedReport.createdAt).toLocaleDateString()}
                </p>
              </div>
              </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        <div className="bg-gray-700 p-3 sm:p-4 rounded">
          <p className="text-gray-400 text-sm sm:text-base">Total Sales</p>
          <p className="font-medium text-green-400 text-sm sm:text-base">
            ${selectedReport.totalSales?.toFixed(2) || "0.00"}
          </p>
        </div>
        <div className="bg-gray-700 p-3 sm:p-4 rounded">
          <p className="text-gray-400 text-sm sm:text-base">Profit/Loss</p>
          <p className={`font-medium ${
            selectedReport.profitOrLoss >= 0 ? 'text-green-400' : 'text-red-400'
          } text-sm sm:text-base`}>
            ${selectedReport.profitOrLoss?.toFixed(2) || "0.00"}
          </p>
        </div>
      </div>


           <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-700 rounded-lg">
                <thead className="bg-gray-600">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 text-left text-gray-300 font-semibold text-xs sm:text-sm">Product</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-gray-300 font-semibold text-xs sm:text-sm">Type</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-gray-300 font-semibold text-xs sm:text-sm">Qty</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-gray-300 font-semibold text-xs sm:text-sm">Purchase</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-gray-300 font-semibold text-xs sm:text-sm">Sale</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-gray-300 font-semibold text-xs sm:text-sm">Total</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-gray-300 font-semibold text-xs sm:text-sm">Date</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-gray-300 font-semibold text-xs sm:text-sm">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedReport.reportData?.map((item, index) => {
                    const purchasePrice = item.purchasePrice ?? (item.totalPrice / item.quantity * 0.8);
                    const salePrice = item.salePrice ?? (item.totalPrice / item.quantity);
                    
                    return (
                      <tr key={index} className="border-t border-gray-600">
                        <td className="px-2 sm:px-4 py-2 text-gray-300 text-xs sm:text-sm">{item.name || 'N/A'}</td>
                        <td className="px-2 sm:px-4 py-2 text-gray-300 text-xs sm:text-sm">
                          {item.type || (item.totalPrice === item.purchasePrice * item.quantity ? 'Purchase' : 'Sale')}
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-gray-300 text-xs sm:text-sm">{item.quantity || 0}</td>
                        <td className="px-2 sm:px-4 py-2 text-gray-300 text-xs sm:text-sm">${purchasePrice.toFixed(2)}</td>
                        <td className="px-2 sm:px-4 py-2 text-gray-300 text-xs sm:text-sm">${salePrice.toFixed(2)}</td>
                        <td className="px-2 sm:px-4 py-2 text-gray-300 text-xs sm:text-sm">${(item.totalPrice || 0).toFixed(2)}</td>
                        <td className="px-2 sm:px-4 py-2 text-gray-300 text-xs sm:text-sm">
                          {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-gray-300 text-xs sm:text-sm">
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
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedReport(null)}
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

export default AdminReports;