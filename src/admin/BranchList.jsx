import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FaPen, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BranchList() {
  const [branches, setBranches] = useState([]);
  const [editingBranchId, setEditingBranchId] = useState(null);
  const [branchEditData, setBranchEditData] = useState({
    branchName: "",
    location: "",
    manager: ""
  });
  const [errors, setErrors] = useState({
    branchName: "",
    location: "",
    manager: ""
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    fetchBranches();
    fetchManagers();
  }, []);

  const fetchBranches = () => {
    axios
      .get("http://localhost:3001/branches")
      .then((response) => setBranches(response.data))
      .catch((err) => console.error("Error fetching branches", err));
  };

  const fetchManagers = () => {
    axios
      .get("http://localhost:3001/users")
      .then((res) => {
        const onlyManagers = res.data.filter(user => user.role === "manager");
        setManagers(onlyManagers);
      })
      .catch((err) => console.error("Error fetching managers", err));
  };

  const handleEditClick = (branch) => {
    setEditingBranchId(branch._id);
    setBranchEditData({
      branchName: branch.branchName,
      location: branch.location,
      manager: branch.manager?._id || ""
    });
    setErrors({
      branchName: "",
      location: "",
      manager: ""
    });
  };

  const validateForm = () => {
    const onlyNumbersRegex = /^\d+$/; // Checks if string contains only numbers
    const containsLettersRegex = /[a-zA-Z]/; // Checks if string contains at least one letter
  
    const newErrors = {
      branchName: !branchEditData.branchName
        ? "Branch name is required"
        : onlyNumbersRegex.test(branchEditData.branchName)
        ? "Branch name cannot be only numbers"
        : "",
      location: !branchEditData.location
        ? "Location is required"
        : onlyNumbersRegex.test(branchEditData.location)
        ? "Location cannot be only numbers"
        : "",
      manager: !branchEditData.manager
        ? "Manager is required"
        : ""
    };
  
    setErrors(newErrors);
    return !newErrors.branchName && !newErrors.location && !newErrors.manager;
  };

  const handleSaveClick = () => {
    if (!validateForm()) return;

    axios
      .put(`http://localhost:3001/branches/${editingBranchId}`, {
        branchName: branchEditData.branchName,
        location: branchEditData.location,
        managerId: branchEditData.manager
      })
      .then(() => {
        fetchBranches();
        setEditingBranchId(null);
        toast.success("Branch updated successfully!");
      })
      .catch((err) => {
        console.error("Error saving branch", err);
        toast.error("Failed to update branch");
      });
  };

  const handleCancelClick = () => {
    setEditingBranchId(null);
    setBranchEditData({
      branchName: "",
      location: "",
      manager: ""
    });
  };

  const handleDelete = async (branchId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/branches/${branchId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBranches(branches.filter((b) => b._id !== branchId));
      setConfirmDeleteId(null);
      toast.success("Branch deleted successfully!");
    } catch (err) {
      console.error("Error deleting branch:", err);
      toast.error(err.response?.data?.message || "Failed to delete branch");
    }
  };

  const filteredBranches = useMemo(() => {
    if (!searchQuery.trim()) return branches;

    const query = searchQuery.toLowerCase();
    return branches.filter((branch) => {
      const managerName = branch.manager?.name?.toLowerCase() || "";
      return (
        branch.branchName.toLowerCase().includes(query) ||
        branch.location.toLowerCase().includes(query) ||
        managerName.includes(query)
      );
    });
  }, [branches, searchQuery]);

  return (
    <div className="bg-gray-900 min-h-screen py-4 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mt-24">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-white">List of Branches</h3>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search branches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Branch Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Manager</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredBranches.length > 0 ? (
                  filteredBranches.map((branch) => (
                    <tr key={branch._id} className="bg-gray-800 hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                        {editingBranchId === branch._id ? (
                          <div>
                            <input
                              type="text"
                              value={branchEditData.branchName}
                              onChange={(e) => setBranchEditData({...branchEditData, branchName: e.target.value})}
                              className={`w-full px-2 py-1 bg-gray-700 text-white border ${errors.branchName ? "border-red-500" : "border-gray-600"} rounded`}
                            />
                            {errors.branchName && <p className="text-red-400 text-xs mt-1">{errors.branchName}</p>}
                          </div>
                        ) : (
                          branch.branchName
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                        {editingBranchId === branch._id ? (
                          <div>
                            <input
                              type="text"
                              value={branchEditData.location}
                              onChange={(e) => setBranchEditData({...branchEditData, location: e.target.value})}
                              className={`w-full px-2 py-1 bg-gray-700 text-white border ${errors.location ? "border-red-500" : "border-gray-600"} rounded`}
                            />
                            {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
                          </div>
                        ) : (
                          branch.location
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                        {editingBranchId === branch._id ? (
                          <div>
                            <select
                              value={branchEditData.manager}
                              onChange={(e) => setBranchEditData({...branchEditData, manager: e.target.value})}
                              className={`w-full px-2 py-1 bg-gray-700 text-white border ${errors.manager ? "border-red-500" : "border-gray-600"} rounded`}
                            >
                              <option value="">-- Select Manager --</option>
                              {managers.map((m) => (
                                <option key={m._id} value={m._id}>{m.name}</option>
                              ))}
                            </select>
                            {errors.manager && <p className="text-red-400 text-xs mt-1">{errors.manager}</p>}
                          </div>
                        ) : (
                          branch.manager ? branch.manager.name : "No Manager Assigned"
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                        {editingBranchId === branch._id ? (
                          <div className="flex space-x-2">
                            <button onClick={handleSaveClick} className="p-2 bg-green-600 hover:bg-green-500 text-white rounded">
                              <FaCheck />
                            </button>
                            <button onClick={handleCancelClick} className="p-2 bg-red-600 hover:bg-red-500 text-white rounded">
                              <FaTimes />
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button onClick={() => handleEditClick(branch)} className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded">
                              <FaPen />
                            </button>
                            <button onClick={() => setConfirmDeleteId(branch._id)} className="p-2 bg-red-600 hover:bg-red-500 text-white rounded">
                              <FaTrash />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-4 text-center text-gray-400">
                      No branches found matching "{searchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this branch?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default BranchList;