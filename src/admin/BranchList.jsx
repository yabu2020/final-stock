import React, { useEffect, useState,useMemo } from "react";
import axios from "axios";
import { FaPen, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BranchList() {
  const [branches, setBranches] = useState([]);
  const [editingBranchId, setEditingBranchId] = useState(null);
  const [branchEditData, setBranchEditData] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch branches on mount
  useEffect(() => {
    axios
      .get("http://localhost:3001/branches")
      .then((response) => setBranches(response.data))
      .catch((err) => console.error("Error fetching branches", err));
  }, []);

  // Handle Edit Click
  const handleEditClick = (branch) => {
    setEditingBranchId(branch._id);
    setBranchEditData({
      branchName: branch.branchName,
      location: branch.location,
    });
  };

  // Handle Save Click
  const handleSaveClick = () => {
    if (!branchEditData.branchName || !branchEditData.location) return;

    axios
      .put(`http://localhost:3001/branches/${editingBranchId}`, branchEditData)
      .then(() => {
        // Update local state after saving
        setBranches(
          branches.map((b) =>
            b._id === editingBranchId ? { ...b, ...branchEditData } : b
          )
        );
        setEditingBranchId(null);
        toast.success(" updated successfully!");

      })
      .catch((err) => console.error("Error saving branch", err));
  };

  // Handle Cancel Click
  const handleCancelClick = () => {
    setBranchEditData({});
    setEditingBranchId(null);
  };

  // Handle Delete Click
  const handleDelete = async (branchId) => {
    try {
      await axios.delete(`http://localhost:3001/branches/${branchId}`);
      setBranches(branches.filter((b) => b._id !== branchId));
      setConfirmDeleteId(null);
      toast.success("Branch deleted successfully!"); // ✅ Success toast
    } catch (err) {
      console.error("Error deleting branch:", err.response?.data || err.message);
      alert("Failed to delete branch");
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
                          <input
                            type="text"
                            name="branchName"
                            value={branchEditData.branchName || branch.branchName}
                            onChange={(e) =>
                              setBranchEditData({
                                ...branchEditData,
                                branchName: e.target.value,
                              })
                            }
                            style={{
                              width: "100%",
                              backgroundColor: "#111827",
                              color: "white",
                              border: "1px solid #4a5568",
                              borderRadius: "4px",
                              padding: "0.5rem",
                            }}
                          />
                        ) : (
                          branch.branchName
                        )}
                      </td>

                      {/* Location */}
                      <td style={tableCellStyle}>
                        {editingBranchId === branch._id ? (
                          <input
                            type="text"
                            name="location"
                            value={branchEditData.location || branch.location}
                            onChange={(e) =>
                              setBranchEditData({
                                ...branchEditData,
                                location: e.target.value,
                              })
                            }
                            style={{
                              width: "100%",
                              backgroundColor: "#111827",
                              color: "white",
                              border: "1px solid #4a5568",
                              borderRadius: "4px",
                              padding: "0.5rem",
                            }}
                          />
                        ) : (
                          branch.location
                        )}
                      </td>

                      {/* Manager */}
                      <td style={tableCellStyle}>
                        {branch.manager ? branch.manager.name : "No Manager Assigned"}
                      </td>

                      {/* Actions */}
                      <td style={tableCellStyle}>
                        {editingBranchId === branch._id ? (
                          <>
                            {/* Save Button */}
                            <button
                              onClick={handleSaveClick}
                              style={{
                                backgroundColor: "#10b981",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "0.5rem",
                                cursor: "pointer",
                                marginRight: "0.5rem",
                              }}
                            >
                              <FaCheck /> {/* Save icon */}
                            </button>

                            {/* Cancel Button */}
                            <button
                              onClick={handleCancelClick}
                              style={{
                                backgroundColor: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "0.5rem",
                                cursor: "pointer",
                              }}
                            >
                              <FaTimes /> {/* Cancel icon */}
                            </button>
                          </>
                        ) : (
                          <>
                            {/* Edit Button */}
                            <button
                              onClick={() => handleEditClick(branch)}
                              style={{
                                backgroundColor: "#3b82f6",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "0.5rem",
                                cursor: "pointer",
                                marginRight: "0.5rem",
                              }}
                            >
                              <FaPen /> {/* Edit icon */}
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => setConfirmDeleteId(branch._id)}
                              style={{
                                backgroundColor: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "0.5rem",
                                cursor: "pointer",
                              }}
                            >
                              <FaTrash /> {/* Delete icon */}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "2rem", color: "#cbd5e1" }}>
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
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            backgroundColor: "#1f2937",
            padding: "1.5rem",
            borderRadius: "8px",
            maxWidth: "400px",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          <h3 style={{ color: "white", marginBottom: "1rem" }}>
            Are you sure you want to delete this branch?
          </h3>
          <div>
            <button
              onClick={() => {
                handleDelete(confirmDeleteId);
                setConfirmDeleteId(null);
              }}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "0.5rem 1rem",
                marginRight: "1rem",
                cursor: "pointer",
              }}
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setConfirmDeleteId(null)}
              style={{
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "0.5rem 1rem",
                cursor: "pointer",
              }}
            >
              Cancel
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