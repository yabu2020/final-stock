// src/admin/Expense.jsx
import { useEffect, useState, useRef } from "react";
import api from '../api'; // ✅ Use centralized API instance

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
  const [searchTerm, setSearchTerm] = useState("");

  // Optional: debounce search (uncomment if needed)
  // const debounceTimeout = useRef(null);
  // useEffect(() => {
  //   if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
  //   debounceTimeout.current = setTimeout(() => {
  //     // search logic handled in filteredData
  //   }, 300);
  //   return () => clearTimeout(debounceTimeout.current);
  // }, [searchTerm]);

  const categories = [
    "Electricity",
    "Water",
    "Salary",
    "Ingredient",
    "tax 3 month",
    "rent almi",
    "Other"
  ];

  const getCategoryColor = (cat) => {
    const colors = {
      "Electricity": "bg-yellow-900/40 text-yellow-300 border-yellow-800",
      "Water": "bg-blue-900/40 text-blue-300 border-blue-800",
      "Salary": "bg-green-900/40 text-green-300 border-green-800",
      "Ingredient": "bg-purple-900/40 text-purple-300 border-purple-800",
      "tax 3 month": "bg-amber-900/40 text-amber-300 border-amber-800",
      "rent almi": "bg-cyan-900/40 text-cyan-300 border-cyan-800",
      "Other": "bg-gray-900/40 text-gray-300 border-gray-700",
    };
    return colors[cat] || "bg-gray-900/40 text-gray-300 border-gray-700";
  };

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

  const formatCurrency = (num) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/expense"); // ✅ api instead of axios
      if (!Array.isArray(res.data)) throw new Error("Invalid response format");
      setData(res.data);
    } catch (err) {
      console.error("Load error:", err);
      setError("Failed to load expenses: " + (err.response?.data?.error || err.message || "Unknown error"));
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
    if (!title.trim() || !amount || !category || !date) {
      setError("Please fill all required fields (Title, Amount, Category, Date).");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        title: title.trim(),
        amount: parseFloat(amount),
        category: category,
        note: note.trim() || undefined,
        date: date
      };

      if (editingId) {
        await api.put(`/expense/${editingId}`, payload); // ✅
        setEditingId(null);
      } else {
        await api.post("/expense", payload); // ✅
      }

      // Reset form
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
      const msg = err.response?.data?.error || err.message || "Failed to save expense.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setForm({
      title: expense.title || "",
      amount: (expense.amount ?? "").toString(),
      category: expense.category || "",
      note: expense.note || "",
      date: expense.date 
        ? new Date(expense.date).toISOString().split("T")[0] 
        : new Date().toISOString().split("T")[0]
    });
    setEditingId(expense._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure?\nThis will permanently delete the expense.")) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/expense/${id}`); // ✅
      await load();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete: " + (err.response?.data?.error || err.message || "Request failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setForm({
      title: "",
      amount: "",
      category: "",
      note: "",
      date: new Date().toISOString().split("T")[0]
    });
    setEditingId(null);
    setError("");
  };

  const filteredData = data.filter((e) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      (e.title || "").toLowerCase().includes(term) ||
      (e.category || "").toLowerCase().includes(term) ||
      (e.note || "").toLowerCase().includes(term) ||
      formatDate(e.date).toLowerCase().includes(term) ||
      e.amount?.toString().includes(term)
    );
  });

  const totalAmount = filteredData.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-white">💸 Expense Tracker</h1>
          <div className="text-sm text-green-400 font-medium">
            Total: {formatCurrency(totalAmount)}
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border-l-4 border-red-500 text-red-200 p-3 mb-5 rounded">
            <p className="text-sm flex items-start gap-1">
              <span>⚠️</span> <span>{error}</span>
            </p>
          </div>
        )}

        {/* Responsive Form Grid */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-700 shadow">
          <h2 className="text-lg font-semibold text-white mb-3">
            {editingId ? "✏️ Edit Expense" : "➕ Add New Expense"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {/* Title */}
            <div className="sm:col-span-2 md:col-span-2">
              <label htmlFor="title" className="block text-xs font-medium text-gray-400 mb-1">
                Title *
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g., Electricity bill"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
              />
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-xs font-medium text-gray-400 mb-1">
                Amount *
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-xs font-medium text-gray-400 mb-1">
                Date *
              </label>
              <input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
              />
            </div>

            {/* Category */}
            <div className="sm:col-span-2 md:col-span-4 lg:col-span-1">
              <label htmlFor="category" className="block text-xs font-medium text-gray-400 mb-1">
                Category *
              </label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 appearance-none"
              >
                <option value="">Select</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Note */}
            <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
              <label htmlFor="note" className="block text-xs font-medium text-gray-400 mb-1">
                Note (Optional)
              </label>
              <input
                id="note"
                type="text"
                placeholder="e.g., Invoice #INV-123"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="sm:col-span-2 md:col-span-1 lg:col-span-1 flex flex-row sm:flex-col gap-2">
              <button
                type="button"
                onClick={save}
                disabled={loading}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition flex-1 ${
                  loading
                    ? "bg-gray-700 cursor-not-allowed"
                    : editingId
                    ? "bg-yellow-600 hover:bg-yellow-500"
                    : "bg-red-600 hover:bg-red-500"
                } text-white whitespace-nowrap`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-1">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0a8 8 0 018 8v4H4z"></path>
                    </svg>
                    {editingId ? "Updating..." : "Saving..."}
                  </span>
                ) : editingId ? (
                  "✅ Update"
                ) : (
                  "➕ Add"
                )}
              </button>

              {(editingId || form.title || form.amount) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-2 text-sm font-medium bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition flex-1"
                >
                  🧹 Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search & Table */}
        <div className="mt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold text-white">Expense History</h2>
            <div className="text-sm text-gray-400">
              {data.length} record{data.length !== 1 ? "s" : ""} • {filteredData.length} shown
            </div>
          </div>

          {/* Search Bar */}
          {data.length > 0 && (
            <div className="mb-4 max-w-md">
              <label htmlFor="search" className="block text-xs font-medium text-gray-400 mb-1">
                🔍 Search (Title, Category, Amount, Date, Note)
              </label>
              <input
                id="search"
                type="text"
                placeholder="e.g., flour, 500, Jan 5..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
              />
            </div>
          )}

          {/* Results */}
          {loading && !data.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3"></div>
              Loading expenses...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-10 bg-gray-800/50 rounded-xl">
              <div className="text-4xl mb-2">🧾</div>
              <p className="text-gray-400 text-lg font-medium mb-1">
                {searchTerm ? "No matching expenses" : "No expenses yet"}
              </p>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try a different keyword."
                  : "Add your first expense above."}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm divide-y divide-gray-700">
                  <thead className="bg-gray-750 text-gray-300 uppercase text-xs">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left font-medium">Date</th>
                      <th scope="col" className="px-3 py-2 text-left font-medium">Title & Note</th>
                      <th scope="col" className="px-3 py-2 text-left font-medium">Category</th>
                      <th scope="col" className="px-3 py-2 text-right font-medium">Amount</th>
                      <th scope="col" className="px-3 py-2 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-750">
                    {filteredData.map((e) => (
                      <tr key={e._id} className="hover:bg-gray-750/60 transition-colors">
                        <td className="px-3 py-3 font-medium text-gray-200 whitespace-nowrap">
                          {formatDate(e.date)}
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-medium text-white">{e.title}</div>
                          {e.note && (
                            <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                              📝 {e.note}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`px-2 py-1 text-[11px] font-medium rounded-full border ${getCategoryColor(
                              e.category
                            )}`}
                          >
                            {e.category}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right font-semibold text-red-400 whitespace-nowrap">
                          {formatCurrency(e.amount)}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-1">
                            <button
                              onClick={() => handleEdit(e)}
                              className="text-[11px] px-2.5 py-1 bg-blue-800 hover:bg-blue-700 text-white rounded whitespace-nowrap transition"
                              aria-label={`Edit ${e.title}`}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDelete(e._id)}
                              className="text-[11px] px-2.5 py-1 bg-red-800 hover:bg-red-700 text-white rounded whitespace-nowrap transition"
                              aria-label={`Delete ${e.title}`}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Expense;