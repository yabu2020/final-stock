// UserList.js
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaPen, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userEditData, setUserEditData] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/users")
      .then((response) => setUsers(response.data))
      .catch((err) => console.log("Error fetching users", err));
  }, []);

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setUserEditData({ ...user });
  };

  const handleSaveClick = () => {
    axios
      .put(`http://localhost:3001/users/${editingUserId}`, userEditData)
      .then(() => {
        // ✅ Update local state immediately using userEditData
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === editingUserId ? { ...user, ...userEditData } : user
          )
        );
  
        setEditingUserId(null);
        setUserEditData({});
        
        toast.success("User updated successfully!");
      })
      .catch((err) => {
        console.error("Error saving user", err);
        toast.error("Failed to update user");
      });
  };

  const handleCancelClick = () => {
    setEditingUserId(null);
    setUserEditData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/users/${id}`)
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        toast.success("User deleted successfully!"); // ✅ Success toast
      })
      .catch((err) => {
        console.log("Error deleting user", err);
        toast.error("Failed to delete user"); // ✅ Error toast
      });
  };
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
  
    const query = searchQuery.toLowerCase();
    return users.filter((user) =>
      Object.values(user).some(
        (val) =>
          val &&
          typeof val === "string" &&
          val.toLowerCase().includes(query)
      )
    );
  }, [users, searchQuery]);

  const tableHeaderStyle = {
    backgroundColor: "#2d3748",
    color: "white",
    padding: "0.75rem",
    textAlign: "left",
    border: "1px solid #4a5568",
  };
  
  const tableCellStyle = {
    border: "1px solid #4a5568",
    padding: "0.75rem",
    color: "#cbd5e1",
    textAlign: "left",
  };
  
  // Define fixed widths for each column
  const columnWidths = {
    name: "20%",
    role: "15%",
    phone: "15%",
    address: "20%",
    actions: "10%",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem 0.75rem",
    borderRadius: "6px",
    border: "1px solid #4a5568",
    backgroundColor: "#2d3748",
    color: "white",
    fontSize: "1rem",
    boxSizing: "border-box",
  };
  
  return (
    <section style={{ backgroundColor: "#1f2937", padding: "1rem" }}>
      <div style={{ marginLeft: "60px", marginTop: "2rem" }}>
        <div
          style={{
            backgroundColor: "#1c1c2e",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            overflow: "hidden",
            padding: "1rem"

          }}
        >
          {/* Header Section */}
          <div style={{
    borderBottom: "1px solid #4a5568",
    paddingBottom: "1rem",
    marginBottom: "1rem"
  }}>
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h3 style={{
        color: "white",
        fontSize: "1.5rem",
        fontWeight: "bold",
        textAlign: "center",
        flex: 1
      }}>             List of Users
              </h3>
              <Link to="/admin/adduser">
                <button
                  style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#2c7ae0")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
                >
                  New User
                </button>
              </Link>
            </div>
          </div>
  
          {/* Search Bar */}
          <div className="mb-4 px-4">
            <input
              type="text"
              placeholder="Search users by name, role, phone or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
  
          {/* Table Section */}
          <div style={{ padding: "1rem" }}>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <table
        style={{
          width: "90%",
          borderCollapse: "collapse",
          backgroundColor: "#1f2937",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      ><thead>
      <tr>
        <th style={{ ...tableHeaderStyle, width: columnWidths.name }}>Name</th>
        <th style={{ ...tableHeaderStyle, width: columnWidths.role }}>Role</th>
        <th style={{ ...tableHeaderStyle, width: columnWidths.phone }}>Phone</th>
        <th style={{ ...tableHeaderStyle, width: columnWidths.address }}>Address</th>
        <th style={{ ...tableHeaderStyle, width: columnWidths.actions }}>Actions</th>
      </tr>
    </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      
                      <tr
                        key={user._id}
                        style={{
                          backgroundColor: "#1c1c2e",
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        <td style={tableCellStyle}>
                          {editingUserId === user._id ? (
                            <input
                              type="text"
                              name="name"
                              value={userEditData.name || ""}
                              onChange={handleInputChange}
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
                            user.name
                          )}
                        </td>
                        <td style={tableCellStyle}>
                          {editingUserId === user._id ? (
                            
                            <input
                              type="text"
                              name="role"
                              value={userEditData.role || ""}
                              onChange={handleInputChange}
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
                            user.role
                          )}
                          
                        </td>
                        <td style={tableCellStyle}>
                          {editingUserId === user._id ? (
                            <input
                              type="text"
                              name="phone"
                              value={userEditData.phone || ""}
                              onChange={handleInputChange}
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
                            user.phone
                          )}
                        </td>
                        <td style={tableCellStyle}>
                          {editingUserId === user._id ? (
                            <input
                              type="text"
                              name="address"
                              value={userEditData.address || ""}
                              onChange={handleInputChange}
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
                            user.address
                          )}
                        </td>
                        <td style={{
  ...tableCellStyle,
  display: "flex",
  alignItems: "center",
  gap: "0.5rem"
}}>
                          {editingUserId === user._id ? (
                            <>
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
                                <FaCheck />
                              </button>
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
                                <FaTimes />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditClick(user)}
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
                                <FaPen />
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(user._id)}
                                style={{
                                  backgroundColor: "#ef4444",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  padding: "0.5rem",
                                  cursor: "pointer",
                                }}
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
                      <td colSpan="5" style={{ textAlign: "center", padding: "2rem", color: "#cbd5e1" }}>
                        No users found matching "{searchQuery}"
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
              Are you sure you want to delete this user?
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
  
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
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

export default UserList;