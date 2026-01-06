// src/admin/Bread.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function Bread() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", size: "", price: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
      const res = await axios.get("/bread");
      if (!Array.isArray(res.data)) throw new Error("Invalid response format");
      setList(res.data);
    } catch (err) {
      console.error("Load error:", err);
      setError("Failed to load bread list: " + (err.response?.data?.error || err.message));
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    const { name, size, price } = form;
    if (!name.trim() || !size.trim() || !price) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const payload = {
        name: name.trim(),
        size: size.trim(),
        price: Number(price)
      };

      if (editingId) {
        await axios.put(`/bread/${editingId}`, payload);
        setEditingId(null);
      } else {
        await axios.post("/bread", payload);
      }

      setForm({ name: "", size: "", price: "" });
      await load();
    } catch (err) {
      console.error("Save error:", err);
      const msg = err.response?.data?.error || "Failed to save bread.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bread) => {
    setForm({
      name: bread.name,
      size: bread.size,
      price: bread.price.toString()
    });
    setEditingId(bread._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure?\nThis will delete the bread item permanently.")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/bread/${id}`);
      await load();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const filteredData = list.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.price.toString().includes(searchTerm)
  );

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl font-bold text-white mb-4 sm:text-2xl">🍞 Bread List</h1>

        {error && (
          <div className="bg-red-900/30 border-l-4 border-red-500 text-red-200 p-3 mb-4 rounded sm:p-4">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Responsive Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Name</label>
            <input
              type="text"
              placeholder="e.g., Whole Wheat"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Size</label>
            <select
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 appearance-none"
            >
              <option value="">Select size</option>
              <option value="bal 10 patra 12">bal 10 patra 12</option>
              <option value="bal 10 patra 15">bal 10 patra 15</option>
              <option value="bal 10 patra 18">bal 10 patra 18</option>
              <option value="bal 15">bal 15</option>
              <option value="bal 20">bal 20</option>
              <option value="bal 30">bal 30</option>
              <option value="bal 40">bal 40</option>
              <option value="bal 50">bal 50</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g., 50.00"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={save}
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
            "✏️ Update Bread"
          ) : (
            "✅ Add Bread"
          )}
        </button>

        {/* Search & Table */}
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold text-white">Bread Inventory</h2>
            
            {list.length > 0 && (
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="🔍 Search (Name, Size, Price)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-400"
                />
              </div>
            )}
          </div>

          {loading && list.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-800/50 rounded-lg">
              {searchTerm ? "No matches found." : "No bread added yet."}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700 text-sm">
                <thead className="bg-gray-750">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase tracking-wider">Size</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase tracking-wider">Price</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase tracking-wider">Added</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredData.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-3 py-2.5 font-medium text-gray-200">{b.name}</td>
                      <td className="px-3 py-2.5">{b.size}</td>
                      <td className="px-3 py-2.5 text-green-400 font-medium">₹{b.price}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-400">{formatDate(b.createdAt)}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() => handleEdit(b)}
                            className="text-[11px] px-2 py-1 bg-blue-800 hover:bg-blue-700 text-white rounded whitespace-nowrap"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(b._id)}
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

export default Bread;