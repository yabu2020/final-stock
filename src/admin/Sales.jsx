// src/admin/Sales.jsx
import { useEffect, useState } from "react";
import api from '../api';

function Sales() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    baking: "",
    bread: "", // 👈 NEW!
    quantitySold: "",
    sellingPrice: "",
    paymentMethod: "cash",
    date: new Date().toISOString().split("T")[0],
    _originalQuantity: 0
  });
  const [loading, setLoading] = useState(false);
  const [loadingBread, setLoadingBread] = useState(true);
  const [error, setError] = useState("");
  const [breadOptions, setBreadOptions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [bakingBatches, setBakingBatches] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "—"
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        });
  };

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/sales");
      if (!Array.isArray(res.data)) throw new Error("Expected array");
      setData(res.data);
    } catch (err) {
      console.error("Load sales error:", err);
      setError("Failed to load sales: " + (err.response?.data?.error || err.message || "Unknown error"));
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBreadAndBatches = async () => {
    try {
      setLoadingBread(true);
      
      const breadRes = await api.get("/bread");
      const breads = Array.isArray(breadRes.data) ? breadRes.data : [];
      setBreadOptions(breads);

      const bakingRes = await api.get("/baking");
      const bakingRecords = Array.isArray(bakingRes.data) ? bakingRes.data : [];

      const batchesWithStock = await Promise.all(
        bakingRecords.map(async (batch) => {
          const salesRes = await api.get(`/sales?baking=${batch._id}`);
          const sold = salesRes.data.reduce((sum, s) => sum + (s.quantitySold || 0), 0);
          const remaining = (batch.quantityBaked || 0) - sold;
          return {
            ...batch,
            remaining,
            breadName: batch.bread?.name || "Unknown",
            breadSize: batch.bread?.size || "—"
          };
        })
      );

      const availableBatches = batchesWithStock.filter(b => b.remaining > 0);
      setBakingBatches(availableBatches);
    } catch (err) {
      console.warn("Failed to load bread/batches:", err.message);
      setBreadOptions([]);
      setBakingBatches([]);
    } finally {
      setLoadingBread(false);
    }
  };

  useEffect(() => {
    load();
    loadBreadAndBatches();
  }, []);

  const save = async () => {
    const { baking, quantitySold, sellingPrice, paymentMethod, date, _originalQuantity } = form;
    
    if (!baking || !quantitySold || !sellingPrice || !date) {
      setError("Please fill all required fields (Batch, Qty, Price, Date).");
      return;
    }

    const newQty = Number(quantitySold);
    const qtyChanged = newQty !== _originalQuantity;

    // Only validate stock if quantity changed
    if (qtyChanged) {
      const selectedBatch = bakingBatches.find(b => b._id === baking);
      if (selectedBatch && newQty > selectedBatch.remaining) {
        setError(`Only ${selectedBatch.remaining} loaves available in this batch.`);
        return;
      }
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        baking,
        bread: form.bread, // 👈 Add this
        quantitySold: newQty,
        sellingPrice: Number(sellingPrice),
        paymentMethod,
        date
      };
      if (editingId) {
        await api.put(`/sales/${editingId}`, payload);
        setEditingId(null);
      } else {
        await api.post("/sales", payload);
      }

      // Reset form
      setForm({
        baking: "",
        quantitySold: "",
        sellingPrice: "",
        paymentMethod: "cash",
        date: new Date().toISOString().split("T")[0],
        _originalQuantity: 0
      });
      
      await load();
      await loadBreadAndBatches();
    } catch (err) {
      console.error("Sale error:", err);
      const msg = err.response?.data?.error || err.message || "Failed to record sale.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sale) => {
    setForm({
      baking: sale.baking?._id || sale.baking,
      bread: sale.bread?._id || sale.bread, // 👈 Set bread ID
      quantitySold: (sale.quantitySold ?? "").toString(),
      sellingPrice: (sale.sellingPrice ?? "").toString(),
      paymentMethod: sale.paymentMethod || "cash",
      date: sale.date
        ? new Date(sale.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      _originalQuantity: sale.quantitySold
    });
    setEditingId(sale._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure?\nThis will permanently delete the sale record.")) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/sales/${id}`);
      await load();
      await loadBreadAndBatches();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete: " + (err.response?.data?.error || err.message || "Request failed"));
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((sale) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      (sale.bread?.name || "").toLowerCase().includes(term) ||
      (sale.bread?.size || "").toLowerCase().includes(term) ||
      sale.quantitySold?.toString().includes(term) ||
      sale.sellingPrice?.toString().includes(term) ||
      sale.totalAmount?.toString().includes(term) ||
      (sale.paymentMethod || "").toLowerCase().includes(term) ||
      formatDate(sale.date).toLowerCase().includes(term)
    );
  });

  // Calculate today's total sales
  const today = new Date().toISOString().split('T')[0];
  const todaySales = data.filter(sale => 
    sale.date && sale.date.toString().startsWith(today)
  );
  const todayTotal = todaySales.reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header with Daily Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h1 className="text-xl font-bold text-white sm:text-2xl">💰 Sales Register</h1>
          <div className="flex flex-wrap gap-3 text-sm">
            {filteredData.length > 0 && (
              <div className="font-medium text-green-400">
                Total: ${filteredData.reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0).toFixed(2)}
              </div>
            )}
            <div className="font-medium text-blue-400">
              Today: ${todayTotal.toFixed(2)}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border-l-4 border-red-500 text-red-200 p-3 mb-4 rounded sm:p-4">
            <p className="text-sm flex items-start gap-1">
              <span>⚠️</span> <span>{error}</span>
            </p>
          </div>
        )}

        {/* Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-2">
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Bake Batch (Remaining Stock)
            </label>
            <select
              value={form.baking}
              onChange={(e) => setForm({ ...form, baking: e.target.value })}
              disabled={loadingBread}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 appearance-none"
            >
              <option value="">Select a bake batch</option>
              {loadingBread ? (
                <option disabled>Loading batches...</option>
              ) : bakingBatches.length === 0 ? (
                <option disabled>No batches with stock available</option>
              ) : (
                bakingBatches.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.breadName} ({batch.breadSize}) — {batch.remaining} loaves left
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Qty to Sell</label>
            <input
              type="number"
              min="1"
              placeholder="e.g., 3"
              value={form.quantitySold}
              onChange={(e) => setForm({ ...form, quantitySold: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Selling Price</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="e.g., 35.00"
              value={form.sellingPrice}
              onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Payment</label>
            <select
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 appearance-none"
            >
              <option value="cash">Cash</option>
              <option value="credit">Credit</option>
            </select>
          </div>
        </div>

        {/* Sell Button */}
        <button
          onClick={save}
          disabled={loading || loadingBread}
          className={`w-full py-2.5 font-medium rounded-lg transition text-sm md:w-auto md:px-5 ${
            loading || loadingBread
              ? "bg-blue-700 opacity-70 cursor-not-allowed"
              : editingId
              ? "bg-yellow-600 hover:bg-yellow-500"
              : "bg-blue-600 hover:bg-blue-500"
          } text-white`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-1">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0a8 8 0 11-16 0z"></path>
              </svg>
              {editingId ? "Updating..." : "Processing..."}
            </span>
          ) : editingId ? (
            "✏️ Update Sale"
          ) : (
            "🛒 Sell Now"
          )}
        </button>

        {/* Daily Summary Card */}
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="text-sm font-medium text-gray-300">📅 Today's Summary</div>
          <div className="mt-1 text-lg font-bold text-blue-400">
            ${todayTotal.toFixed(2)} from {todaySales.length} sale{todaySales.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Search & Table */}
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold text-white">Sales History</h2>
            <div className="text-xs text-gray-400">
              {data.length} record{data.length !== 1 ? "s" : ""} • {filteredData.length} shown
            </div>
          </div>

          {data.length > 0 && (
            <div className="mb-4 max-w-md">
              <input
                type="text"
                placeholder="🔍 Search (Bread, Qty, Price, Payment...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-400"
              />
            </div>
          )}

          {loading && data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-2"></div>
              Loading sales...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-800/50 rounded-lg">
              <div className="text-4xl mb-2">💰</div>
              <p className="font-medium">
                {searchTerm ? "No sales match your search" : "No sales recorded yet"}
              </p>
              <p className="text-sm mt-1">
                {searchTerm ? "Try a different keyword." : "Record your first sale above."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700 text-sm">
                <thead className="bg-gray-750 text-gray-300 uppercase text-xs">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left font-medium">Date</th>
                    <th scope="col" className="px-3 py-2 text-left font-medium">Bread</th>
                    <th scope="col" className="px-3 py-2 text-left font-medium">Qty</th>
                    <th scope="col" className="px-3 py-2 text-left font-medium">Price</th>
                    <th scope="col" className="px-3 py-2 text-left font-medium">Total</th>
                    <th scope="col" className="px-3 py-2 text-left font-medium">Remaining</th>
                    <th scope="col" className="px-3 py-2 text-left font-medium">Payment</th>
                    <th scope="col" className="px-3 py-2 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-750">
                  {filteredData.map((sale) => (
                    <tr key={sale._id} className="hover:bg-gray-750/60 transition-colors">
                      <td className="px-3 py-3 font-medium text-gray-200 whitespace-nowrap">
                        {formatDate(sale.date)}
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-medium text-white">
                          {sale.bread?.name || "—"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {sale.bread?.size || "—"}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-300">{sale.quantitySold || 0}</td>
                      <td className="px-3 py-3 text-gray-300">${Number(sale.sellingPrice || 0).toFixed(2)}</td>
                      <td className="px-3 py-3 font-semibold text-green-400">
                        ${Number(sale.totalAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-1 rounded text-[11px] font-medium ${
                          (sale.bakingRemaining || 0) > 0 
                            ? 'bg-green-900/50 text-green-300 border border-green-800'
                            : 'bg-red-900/50 text-red-300 border border-red-800'
                        }`}>
                          {sale.bakingRemaining || 0}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-1 rounded text-[11px] font-medium ${
                          sale.paymentMethod === 'cash'
                            ? 'bg-green-900/50 text-green-300 border border-green-800'
                            : 'bg-yellow-900/50 text-yellow-300 border border-yellow-800'
                        }`}>
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() => handleEdit(sale)}
                            className="text-[11px] px-2.5 py-1 bg-blue-800 hover:bg-blue-700 text-white rounded whitespace-nowrap transition"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(sale._id)}
                            className="text-[11px] px-2.5 py-1 bg-red-800 hover:bg-red-700 text-white rounded whitespace-nowrap transition"
                          >
                            🗑️ Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sales;