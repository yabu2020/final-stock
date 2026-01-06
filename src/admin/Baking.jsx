// src/admin/Baking.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function Baking() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    bread: "",
    quantityBaked: "",
    date: new Date().toISOString().split("T")[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [breadOptions, setBreadOptions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

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
      const res = await axios.get("/baking");
      if (!Array.isArray(res.data)) throw new Error("Expected array");
      setData(res.data);
    } catch (err) {
      console.error("Load error:", err);
      setError(
        "Failed to load baking records: " +
          (err.response?.data?.error || err.message)
      );
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
    const { bread, quantityBaked, date } = form;
    if (!bread || !quantityBaked || !date) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const payload = {
        bread,
        quantityBaked: Number(quantityBaked),
        date
      };

      if (editingId) {
        await axios.put(`/baking/${editingId}`, payload);
        setEditingId(null);
      } else {
        await axios.post("/baking", payload);
      }

      setForm({
        bread: "",
        quantityBaked: "",
        date: new Date().toISOString().split("T")[0]
      });
      await load();
    } catch (err) {
      console.error("Save error:", err);
      setError(err.response?.data?.error || "Failed to record baking.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setForm({
      bread: record.bread?._id || record.bread,
      quantityBaked: record.quantityBaked.toString(),
      date: new Date(record.date).toISOString().split("T")[0]
    });
    setEditingId(record._id);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "⚠️ Are you sure?\nThis will delete the baking record permanently."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/baking/${id}`);
      await load();
    } catch (err) {
      console.error("Delete error:", err);
      setError(
        "Failed to delete: " +
          (err.response?.data?.error || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) => {
    const term = search.toLowerCase();
    const breadName = item.bread?.name?.toLowerCase() || "";
    const breadSize = item.bread?.size?.toLowerCase() || "";
    const dateText = formatDate(item.date).toLowerCase();
    return breadName.includes(term) || breadSize.includes(term) || dateText.includes(term);
  });

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl font-bold text-white mb-4 sm:text-2xl">🍞 Baking Log</h1>

        {error && (
          <div className="bg-red-900/30 border-l-4 border-red-500 text-red-200 p-3 mb-4 rounded">
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
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-1">
            <label className="block text-xs font-medium text-gray-400 mb-1">Bread</label>
            <select
              value={form.bread}
              onChange={(e) => setForm({ ...form, bread: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg appearance-none"
            >
              <option value="">Select bread</option>
              {breadOptions.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name} ({b.size})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Qty</label>
            <input
              type="number"
              min="1"
              value={form.quantityBaked}
              onChange={(e) => setForm({ ...form, quantityBaked: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg"
            />
          </div>
        </div>

        <button
          onClick={save}
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-sm transition disabled:opacity-70 md:w-auto md:px-5"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0a8 8 0 11-16 0z"></path>
              </svg>
              {editingId ? "Updating..." : "Recording..."}
            </span>
          ) : editingId ? (
            "✏️ Update"
          ) : (
            "✅ Record Baking"
          )}
        </button>

        {/* Search & Table */}
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold text-white">Baking History</h2>
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="🔍 Search (Bread, Size, Date)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-gray-700 border border-gray-600 text-white rounded-md"
              />
            </div>
          </div>

          {loading && data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-800/50 rounded-lg">
              {search ? "No matches found." : "No baking records yet."}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700 text-sm">
                <thead className="bg-gray-750">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase">Date</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase">Bread</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase">Qty</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredData.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-3 py-2.5 text-gray-200">{formatDate(item.date)}</td>
                      <td className="px-3 py-2.5">
                        <div>{item.bread?.name}</div>
                        <div className="text-xs text-gray-400">{item.bread?.size}</div>
                      </td>
                      <td className="px-3 py-2.5">{item.quantityBaked}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-[11px] px-2 py-1 bg-blue-800 hover:bg-blue-700 text-white rounded whitespace-nowrap"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
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

export default Baking;