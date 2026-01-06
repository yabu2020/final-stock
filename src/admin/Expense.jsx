// src/admin/Expense.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function Expense() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    note: "",
    date: new Date().toISOString().split("T")[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search state

  const categories = ["Electricity", "Water", "Salary", "Ingredient", "tax 3 month", "rent almi", "Other"];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("/expense");
      if (!Array.isArray(res.data)) throw new Error("Invalid format");
      setData(res.data);
    } catch (err) {
      console.error("Load error:", err);
      setError("Failed to load expenses: " + (err.response?.data?.error || err.message));
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    const { title, amount, category, note, date } = form;
    if (!title || !amount || !category || !date) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        title: title.trim(),
        amount: Number(amount),
        category,
        note: note || undefined,
        date
      };

      if (editingId) {
        await axios.put(`/expense/${editingId}`, payload);
        setEditingId(null);
      } else {
        await axios.post("/expense", payload);
      }

      setForm({
        title: "",
        amount: "",
        category: "",
        note: "",
        date: new Date().toISOString().split("T")[0]
      });
      await load();
    } catch (err) {
      console.error("Save error:", err);
      const msg = err.response?.data?.error || "Failed to save expense.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setForm({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      note: expense.note || "",
      date: new Date(expense.date).toISOString().split("T")[0]
    });
    setEditingId(expense._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure?\nThis will permanently delete the expense.")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/expense/${id}`);
      await load();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Search filter
  const filteredData = data.filter((e) => {
    const term = searchTerm.toLowerCase();
    return (
      e.title.toLowerCase().includes(term) ||
      e.category.toLowerCase().includes(term) ||
      e.amount.toString().includes(term) ||
      formatDate(e.date).toLowerCase().includes(term) ||
      (e.note || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          💸 Expense Tracker
        </h2>

        {error && (
          <div className="bg-red-900/30 border-l-4 border-red-500 text-red-200 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Flour purchase"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Amount <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="e.g., 250.00"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Invoice #INV-123"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={save}
          disabled={loading}
          className={`w-full md:w-auto px-6 py-2 font-medium rounded-lg transition ${
            loading
              ? "bg-red-700 opacity-70 cursor-not-allowed"
              : editingId
              ? "bg-yellow-600 hover:bg-yellow-500"
              : "bg-red-600 hover:bg-red-500"
          } text-white`}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0a8 8 0 11-16 0z"></path>
              </svg>
              {editingId ? "Updating..." : "Adding..."}
            </span>
          ) : editingId ? (
            "✏️ Update Expense"
          ) : (
            "➕ Add Expense"
          )}
        </button>

       {/* Table */}
<div className="mt-10">
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-xl font-semibold text-white">Expense History</h3>
    {filteredData.length > 0 && (
      <div className="text-green-400 font-medium">
        Total: ${filteredData.reduce((sum, e) => sum + (Number(e.amount) || 0), 0).toFixed(2)}
      </div>
    )}
  </div>

  {/* ✅ Search Bar — Shorter, Left-Aligned, Above Table */}
  {data.length > 0 && (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        🔍 Search (Title, Category, Amount, Date, Note)
      </label>
      <div className="max-w-md">
        <input
          type="text"
          placeholder="e.g., flour, 250, Jan 5, Invoice..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-sm"
        />
      </div>
    </div>
  )}

  {loading && data.length === 0 ? (
    <div className="text-center py-8 text-gray-400">Loading...</div>
  ) : filteredData.length === 0 ? (
    <div className="text-center py-8 text-gray-400 bg-gray-700/50 rounded-lg">
      {searchTerm ? "No expenses match your search." : "No expenses recorded yet."}
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700 text-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Note</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700 text-gray-300">
          {filteredData.map((e) => (
            <tr key={e._id} className="hover:bg-gray-700/50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-200">
                {formatDate(e.date)}
              </td>
              <td className="px-4 py-3">
                <div>{e.title}</div>
                {e.note && (
                  <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                    📝 {e.note}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs">
                  {e.category}
                </span>
              </td>
              <td className="px-4 py-3 text-sm max-w-xs">
                {e.note ? (
                  <span className="text-gray-400">{e.note}</span>
                ) : (
                  <span className="text-gray-600">—</span>
                )}
              </td>
              <td className="px-4 py-3 font-semibold text-red-400">
                ${(Number(e.amount) || 0).toFixed(2)}
              </td>
              <td className="px-4 py-3 space-x-2">
                <button
                  onClick={() => handleEdit(e)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(e._id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  🗑️ Delete
                </button>
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

export default Expense;