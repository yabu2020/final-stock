// src/admin/FlourPurchase.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function FlourPurchase() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    date: "",
    quantityKg: "",
    totalPrice: "",
    paymentType: "cash",
    supplierName: "",
    note: "",
    paidDate: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const formatInputDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("/flour-purchase");
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load purchases: " + (err.response?.data?.error || err.message));
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submit = async () => {
    const { date, quantityKg, totalPrice, paymentType, supplierName, note, paidDate } = form;
    if (!quantityKg || !totalPrice || !paymentType) {
      setError("Please fill required fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        date: date || new Date().toISOString().split("T")[0],
        quantityKg: Number(quantityKg),
        totalPrice: Number(totalPrice),
        paymentType,
        supplierName: supplierName || "",
        note: note || ""
      };

      if (editingId && paymentType === "credit") {
        payload.paidDate = paidDate || new Date().toISOString().split("T")[0];
      }

      if (editingId) {
        await axios.put(`/flour-purchase/${editingId}`, payload);
        setEditingId(null);
      } else {
        await axios.post("/flour-purchase", payload);
      }

      setForm({
        date: "",
        quantityKg: "",
        totalPrice: "",
        paymentType: "cash",
        supplierName: "",
        note: "",
        paidDate: ""
      });
      await fetchData();
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to save: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (purchase) => {
    setForm({
      date: formatInputDate(purchase.date),
      quantityKg: purchase.quantityKg.toString(),
      totalPrice: purchase.totalPrice.toString(),
      paymentType: purchase.paymentType,
      supplierName: purchase.supplierName || "",
      note: purchase.note || "",
      paidDate: purchase.paidDate ? formatInputDate(purchase.paidDate) : ""
    });
    setEditingId(purchase._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure?\nThis will reduce flour stock accordingly.")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/flour-purchase/${id}`);
      await fetchData();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (id) => {
    if (!window.confirm("Mark this credit purchase as paid?")) return;

    try {
      setLoading(true);
      await axios.put(`/flour-purchase/${id}/pay`);
      await fetchData();
    } catch (err) {
      console.error("Payment error:", err);
      setError("Failed to record payment: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.quantityKg.toString().includes(term) ||
      p.totalPrice.toString().includes(term) ||
      (p.supplierName || "").toLowerCase().includes(term) ||
      p.paymentType.toLowerCase().includes(term) ||
      (p.status === "pending" ? "pending" : "paid").includes(term)
    );
  });

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl font-bold text-white mb-4 sm:text-2xl sm:mb-6">
          🛒 Flour Purchase
        </h1>

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

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Quantity (Kg)</label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g., 5.0"
              value={form.quantityKg}
              onChange={(e) => setForm({ ...form, quantityKg: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Total Price</label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g., 250.00"
              value={form.totalPrice}
              onChange={(e) => setForm({ ...form, totalPrice: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-3">
            <label className="block text-xs font-medium text-gray-400 mb-1">Supplier Name</label>
            <input
              type="text"
              placeholder="e.g., ABC Suppliers"
              value={form.supplierName}
              onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Payment</label>
            <select
              value={form.paymentType}
              onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 appearance-none"
            >
              <option value="cash">Cash</option>
              <option value="credit">Credit</option>
            </select>
          </div>

          {editingId && form.paymentType === "credit" && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Paid Date</label>
              <input
                type="date"
                value={form.paidDate}
                onChange={(e) => setForm({ ...form, paidDate: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
              />
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={submit}
          disabled={loading}
          className={`w-full py-2.5 font-medium rounded-lg transition text-sm md:w-auto md:px-5 md:py-2.5 ${
            loading
              ? "bg-blue-700 opacity-70 cursor-not-allowed"
              : editingId
              ? "bg-yellow-600 hover:bg-yellow-500"
              : "bg-blue-600 hover:bg-blue-500"
          } text-white`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0a8 8 0 11-16 0z"></path>
              </svg>
              {editingId ? "Updating..." : "Saving..."}
            </span>
          ) : editingId ? (
            "✏️ Update"
          ) : (
            "✅ Save Purchase"
          )}
        </button>

        {/* Search & Summary */}
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold text-white">Purchase History</h2>
            
            {data.length > 0 && (
              <>
                <div className="flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="🔍 Search (Kg, Price, Supplier...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-400"
                  />
                </div>
                
                <div className="text-xs text-gray-400">
                  {filteredData.length} of {data.length}
                </div>
              </>
            )}
          </div>

          {data.length > 0 && (
            <div className="mb-4 p-2 bg-gray-750 rounded text-xs text-gray-300">
              💳 <span className="font-medium">Unpaid:</span> {data.filter(p => p.status === "pending").length}
            </div>
          )}

          {/* Responsive Table */}
          {loading && data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-800/50 rounded-lg">
              {searchTerm ? "No matches found." : "No purchases yet."}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700 text-sm">
                <thead className="bg-gray-750">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase tracking-wider">Kg / ₹</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase tracking-wider">Supplier</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredData.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-3 py-2.5 font-medium text-gray-200">
                        <div className="text-xs text-gray-400">{formatDate(p.date)}</div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="font-medium">{p.quantityKg} kg</div>
                        <div className="text-green-400 font-medium">${p.totalPrice}</div>
                      </td>
                      <td className="px-3 py-2.5 truncate max-w-[120px]">
                        {p.supplierName || "—"}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-col">
                          <span className={`inline-block px-2 py-1 rounded text-[11px] font-medium ${
                            p.status === 'paid'
                              ? p.paymentType === 'cash'
                                ? 'bg-green-900/50 text-green-300'
                                : 'bg-blue-900/50 text-blue-300'
                              : 'bg-yellow-900/50 text-yellow-300'
                          }`}>
                            {p.paymentType}
                            {p.status === "pending" ? " ⏳" : " ✅"}
                          </span>
                          {p.status === "paid" && p.paymentType === "credit" && p.paidDate && (
                            <span className="text-[10px] text-gray-400 mt-0.5">
                              {formatDate(p.paidDate)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">
                          {p.status === "pending" && (
                            <button
                              onClick={() => handlePay(p._id)}
                              className="text-[11px] px-2 py-1 bg-green-800 hover:bg-green-700 text-white rounded whitespace-nowrap"
                            >
                              💰 Pay
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(p)}
                            className="text-[11px] px-2 py-1 bg-blue-800 hover:bg-blue-700 text-white rounded whitespace-nowrap"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
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

export default FlourPurchase;