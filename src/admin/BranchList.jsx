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

  // Fetch branches and managers on mount
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

  // Handle Edit Click
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

  // Validate form fields
  const validateForm = () => {
    const nameRegex = /^[^\d]+$/; // Not just digits
    const locationRegex = /^(?!^\d+$)^.+$/; // Not only digits
  
    const newErrors = {
      branchName: !branchEditData.branchName
        ? "Branch name is required"
        : !nameRegex.test(branchEditData.branchName)
        ? "Branch name cannot be only numbers"
        : "",
      location: !branchEditData.location
        ? "Location is required"
        : !locationRegex.test(branchEditData.location)
        ? "Location must include letters"
        : "",
      manager: !branchEditData.manager
        ? "Manager is required"
        : ""
    };
  
    setErrors(newErrors);
    return !newErrors.branchName && !newErrors.location && !newErrors.manager;
  };
  

  // Handle Save Click
  const handleSaveClick = () => {
    if (!validateForm()) return;

    axios
      .put(`http://localhost:3001/branches/${editingBranchId}`, {
        branchName: branchEditData.branchName,
        location: branchEditData.location,
        managerId: branchEditData.manager
      })
      .then(() => {
        fetchBranches(); // Re-fetch all branches to ensure the manager is populated
        setEditingBranchId(null);
        toast.success("Branch updated successfully!");
      })
      
      .catch((err) => {
        console.error("Error saving branch", err);
        toast.error("Failed to update branch");
      });
  };

  // Handle Cancel Click
  const handleCancelClick = () => {
    setEditingBranchId(null);
    setBranchEditData({
      branchName: "",
      location: "",
      manager: ""
    });
  };

  // Handle Delete Click
  const handleDelete = async (branchId) => {
    try {
      await axios.delete(`http://localhost:3001/branches/${branchId}`);
      setBranches(branches.filter((b) => b._id !== branchId));
      setConfirmDeleteId(null);
      toast.success("Branch deleted successfully!");
    } catch (err) {
      console.error("Error deleting branch:", err);
      toast.error("Failed to delete branch");
    }
  };

  // Filter branches based on search query
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

  // Table Cell Style
  const tableCellStyle = {
    border: "1px solid #4a5568",
    padding: "0.75rem",
    color: "#cbd5e1",
    textAlign: "left",
  };

  return (
    <section className="py-1 bg-gray-900">
      {/* Centered Container */}
      <div className="container mx-auto px-4 mt-24">
        <div className="relative flex flex-col min-w-0 break-words bg-gray-800 w-full mb-6 shadow-lg rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-xl text-white">List of Branches</h3>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4 px-4">
            <input
              type="text"
              placeholder="Search branches by name, location, or manager..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Centered Table */}
          <div className="flex justify-center">
            <div className="block w-full overflow-x-auto" style={{ maxWidth: "900px" }}>
              <table className="items-center bg-transparent w-full border-collapse">
                <thead>
                  <tr>
                    <th style={{ ...tableCellStyle, backgroundColor: "#1f2937" }}>
                      Branch Name
                    </th>
                    <th style={{ ...tableCellStyle, backgroundColor: "#1f2937" }}>
                      Location
                    </th>
                    <th style={{ ...tableCellStyle, backgroundColor: "#1f2937" }}>
                      Manager
                    </th>
                    <th style={{ ...tableCellStyle, backgroundColor: "#1f2937" }}>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBranches.length > 0 ? (
                    filteredBranches.map((branch) => (
                      <tr
                        key={branch._id}
                        style={{
                          backgroundColor: "#1c1c2e",
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        {/* Branch Name */}
                        <td style={tableCellStyle}>
                          {editingBranchId === branch._id ? (
                            <div>
                              <input
                                type="text"
                                name="branchName"
                                value={branchEditData.branchName}
                                onChange={(e) =>
                                  setBranchEditData({
                                    ...branchEditData,
                                    branchName: e.target.value
                                  })
                                }
                                className={`w-full px-2 py-1 bg-gray-700 text-white border ${
                                  errors.branchName ? "border-red-500" : "border-gray-600"
                                } rounded`}
                              />
                              {errors.branchName && (
                                <p className="text-red-400 text-xs mt-1">{errors.branchName}</p>
                              )}
                            </div>
                          ) : (
                            branch.branchName
                          )}
                        </td>

                        {/* Location */}
                        <td style={tableCellStyle}>
                          {editingBranchId === branch._id ? (
                            <div>
                              <input
                                type="text"
                                name="location"
                                value={branchEditData.location}
                                onChange={(e) =>
                                  setBranchEditData({
                                    ...branchEditData,
                                    location: e.target.value
                                  })
                                }
                                className={`w-full px-2 py-1 bg-gray-700 text-white border ${
                                  errors.location ? "border-red-500" : "border-gray-600"
                                } rounded`}
                              />
                              {errors.location && (
                                <p className="text-red-400 text-xs mt-1">{errors.location}</p>
                              )}
                            </div>
                          ) : (
                            branch.location
                          )}
                        </td>

                        {/* Manager */}
                        <td style={tableCellStyle}>
                          {editingBranchId === branch._id ? (
                            <div>
                              <select
                                value={branchEditData.manager}
                                onChange={(e) =>
                                  setBranchEditData({
                                    ...branchEditData,
                                    manager: e.target.value
                                  })
                                }
                                className={`w-full px-2 py-1 bg-gray-700 text-white border ${
                                  errors.manager ? "border-red-500" : "border-gray-600"
                                } rounded`}
                              >
                                <option value="">-- Select Manager --</option>
                                {managers.map((m) => (
                                  <option key={m._id} value={m._id}>
                                    {m.name}
                                  </option>
                                ))}
                              </select>
                              {errors.manager && (
                                <p className="text-red-400 text-xs mt-1">{errors.manager}</p>
                              )}
                            </div>
                          ) : (
                            branch.manager ? branch.manager.name : "No Manager Assigned"
                          )}
                        </td>

                        {/* Actions */}
                        <td style={tableCellStyle}>
                          {editingBranchId === branch._id ? (
                            <>
                              <button
                                onClick={handleSaveClick}
                                className="bg-green-600 hover:bg-green-500 text-white py-1 px-2 rounded mr-2"
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={handleCancelClick}
                                className="bg-red-600 hover:bg-red-500 text-white py-1 px-2 rounded"
                              >
                                <FaTimes />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditClick(branch)}
                                className="bg-blue-600 hover:bg-blue-500 text-white py-1 px-2 rounded mr-2"
                              >
                                <FaPen />
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(branch._id)}
                                className="bg-red-600 hover:bg-red-500 text-white py-1 px-2 rounded"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-400">
                        No branches found matching "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
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
    </section>
  );
}

export default BranchList;