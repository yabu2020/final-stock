// src/admin/Sales.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function Sales() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    bread: "",
    quantitySold: "",
    sellingPrice: "",
    paymentMethod: "cash",
    date: new Date().toISOString().split("T")[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [breadOptions, setBreadOptions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search state

  const formatDate = (dateString) => {
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
      const res = await axios.get("/sales");
      if (!Array.isArray(res.data)) throw new Error("Expected array");
      setData(res.data);
    } catch (err) {
      console.error("Load sales error:", err);
      setError("Failed to load sales: " + (err.response?.data?.error || err.message));
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBreadOptions = async () => {
    try {
      const res = await axios.get("/bread");
      if (Array.isArray(res.data)) setBreadOptions(res.data);
    } catch (err) {
      console.warn("Bread load warning:", err.message);
    }
  };

  useEffect(() => {
    load();
    loadBreadOptions();
  }, []);

  const save = async () => {
    const { bread, quantitySold, sellingPrice, paymentMethod, date } = form;
    if (!bread || !quantitySold || !sellingPrice || !date) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        bread,
        quantitySold: Number(quantitySold),
        sellingPrice: Number(sellingPrice),
        paymentMethod,
        date
      };

      if (editingId) {
        await axios.put(`/sales/${editingId}`, payload);
        setEditingId(null);
      } else {
        await axios.post("/sales", payload);
      }

      setForm({
        bread: "",
        quantitySold: "",
        sellingPrice: "",
        paymentMethod: "cash",
        date: new Date().toISOString().split("T")[0]
      });
      await load();
    } catch (err) {
      console.error("Sale error:", err);
      const msg = err.response?.data?.error || "Failed to record sale.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sale) => {
    setForm({
      bread: sale.bread?._id || sale.bread,
      quantitySold: sale.quantitySold.toString(),
      sellingPrice: sale.sellingPrice.toString(),
      paymentMethod: sale.paymentMethod,
      date: new Date(sale.date).toISOString().split("T")[0]
    });
    setEditingId(sale._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure?\nThis will permanently delete the sale record.")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/sales/${id}`);
      await load();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Search filter
  const filteredData = data.filter((sale) => {
    const term = searchTerm.toLowerCase();
    return (
      (sale.bread?.name || "").toLowerCase().includes(term) ||
      (sale.bread?.size || "").toLowerCase().includes(term) ||
      sale.quantitySold.toString().includes(term) ||
      sale.sellingPrice.toString().includes(term) ||
      sale.totalAmount.toString().includes(term) ||
      sale.paymentMethod.toLowerCase().includes(term) ||
      formatDate(sale.date).toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl font-bold text-white mb-4 sm:text-2xl">💰 Sales Register</h1>

        {error && (
          <div className="bg-red-900/30 border-l-4 border-red-500 text-red-200 p-3 mb-4 rounded sm:p-4">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Responsive Form */}
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

          <div className="sm:col-span-2 md:col-span-1">
            <label className="block text-xs font-medium text-gray-400 mb-1">Bread</label>
            <select
              value={form.bread}
              onChange={(e) => setForm({ ...form, bread: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 appearance-none"
            >
              <option value="">Select bread</option>
              {breadOptions.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name} ({b.size}) — ${b.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Qty</label>
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
          disabled={loading}
          className={`w-full py-2.5 font-medium rounded-lg transition text-sm md:w-auto md:px-5 md:py-2.5 ${
            loading
              ? "bg-blue-700 opacity-70 cursor-not-allowed"
              : editingId
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-blue-600 hover:bg-blue-500"
          } text-white`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0a8 8 0 11-16 0z"></path>
              </svg>
              {editingId ? "Updating..." : "Processing..."}
            </span>
          ) : editingId ? (
            "✏️ Update"
          ) : (
            "🛒 Sell Now"
          )}
        </button>

        {/* Search & Table */}
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold text-white">Sales History</h2>
            
            {data.length > 0 && (
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="🔍 Search (Bread, Qty, Price...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-400"
                />
              </div>
            )}
          </div>

          {loading && data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-800/50 rounded-lg">
              {searchTerm ? "No sales match your search." : "No sales recorded yet."}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700 text-sm">
                <thead className="bg-gray-750">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase tracking-wider">Bread</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase tracking-wider">Qty</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase tracking-wider">Price</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase tracking-wider">Total</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase tracking-wider">Payment</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredData.map((sale) => (
                    <tr key={sale._id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-3 py-2.5 font-medium text-gray-200">
                        {formatDate(sale.date)}
                      </td>
                      <td className="px-3 py-2.5">
                        <div>{sale.bread?.name}</div>
                        <div className="text-xs text-gray-400">{sale.bread?.size}</div>
                      </td>
                      <td className="px-3 py-2.5">{sale.quantitySold}</td>
                      <td className="px-3 py-2.5">${sale.sellingPrice}</td>
                      <td className="px-3 py-2.5 font-semibold text-green-400">${sale.totalAmount}</td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-1 rounded text-[11px] ${
                          sale.paymentMethod === 'cash'
                            ? 'bg-green-900/50 text-green-300'
                            : 'bg-yellow-900/50 text-yellow-300'
                        }`}>
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() => handleEdit(sale)}
                            className="text-[11px] px-2 py-1 bg-blue-800 hover:bg-blue-700 text-white rounded whitespace-nowrap"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(sale._id)}
                            className="text-[11px] px-2 py-1 bg-red-800 hover:bg-red-700 text-white rounded whitespace-nowrap"
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