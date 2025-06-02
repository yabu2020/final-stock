import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaPen, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userEditData, setUserEditData] = useState({});
  const [errors, setErrors] = useState({
    name: "",
    role: "",
    phone: "",
    address: "",
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://localhost:3001/users")
      .then((response) => setUsers(response.data))
      .catch((err) => console.log("Error fetching users", err));
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (!/^[A-Za-z\s]+$/.test(value)) return "Name must contain only letters";
        return "";
      case "role":
        if (!["manager", "admin", "user", "Admin"].includes(value)) return "Invalid role";
        return "";
      case "phone":
        if (!/^(09|07)\d{8}$/.test(value)) return "Phone must start with 09/07 and be 10 digits";
        return "";
      case "address":
        if (!value.trim()) return "Address is required";
        if (/^\d+$/.test(value)) return "Address cannot be only numbers";
        return "";
      default:
        return "";
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setUserEditData({ ...user });
    setErrors({
      name: "",
      role: "",
      phone: "",
      address: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField("name", userEditData.name),
      role: validateField("role", userEditData.role),
      phone: validateField("phone", userEditData.phone),
      address: validateField("address", userEditData.address),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSaveClick = () => {
    if (!validateForm()) return;

    axios
      .put(`http://localhost:3001/users/${editingUserId}`, userEditData)
      .then(() => {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === editingUserId ? { ...user, ...userEditData } : user
          )
        );
        setEditingUserId(null);
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

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/users/${id}`)
      .then(() => {
        setUsers((prev) => prev.filter((user) => user._id !== id));
        toast.success("User deleted successfully!");
      })
      .catch((err) => {
        console.log("Error deleting user", err);
        toast.error("Failed to delete user");
      });
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter((user) =>
      Object.values(user).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(query)
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

  const columnWidths = {
    name: "20%",
    role: "15%",
    phone: "15%",
    address: "20%",
    actions: "10%",
  };

  const inputStyle = (hasError) => ({
    width: "100%",
    padding: "0.5rem 0.75rem",
    borderRadius: "6px",
    border: `1px solid ${hasError ? "#ef4444" : "#4a5568"}`,
    backgroundColor: "#2d3748",
    color: "white",
    fontSize: "1rem",
    boxSizing: "border-box",
  });

  return (
    <section style={{ backgroundColor: "#1f2937", padding: "1rem" }}>
      <div style={{ margin: "2rem auto", maxWidth: "1200px", padding: "0 1rem" }}>
        <div style={{
          backgroundColor: "#1c1c2e",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          overflow: "hidden",
          padding: "1rem"
        }}>
          <div style={{
            borderBottom: "1px solid #4a5568",
            paddingBottom: "1rem",
            marginBottom: "1rem"
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "stretch"
            }}>
              <h3 style={{
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "bold",
                textAlign: "center"
              }}>List of Users</h3>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
                      width: "100%"
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#2c7ae0")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
                  >
                    New User
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "1rem", padding: "0 0.5rem" }}>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                backgroundColor: "#2d3748",
                color: "white",
                border: "1px solid #4a5568",
                borderRadius: "4px",
                fontSize: "1rem"
              }}
            />
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#1f2937",
              borderRadius: "8px",
              overflow: "hidden",
              minWidth: "600px"
            }}>
              <thead>
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
                  filteredUsers.map((user) => (
                    <tr key={user._id} style={{ backgroundColor: "#1c1c2e" }}>
                      <td style={tableCellStyle}>
                        {editingUserId === user._id ? (
                          <>
                            <input
                              type="text"
                              name="name"
                              value={userEditData.name || ""}
                              onChange={handleInputChange}
                              style={inputStyle(errors.name)}
                            />
                            {errors.name && <div style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.name}</div>}
                          </>
                        ) : user.name}
                      </td>

                      <td style={tableCellStyle}>
                        {editingUserId === user._id ? (
                          <>
                            <select
                              name="role"
                              value={userEditData.role || ""}
                              onChange={handleInputChange}
                              style={inputStyle(errors.role)}
                            >
                              <option value="">Select Role</option>
                              <option value="Admin">Admin</option>
                              <option value="manager">Manager</option>
                              <option value="user">User</option>
                            </select>
                            {errors.role && <div style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.role}</div>}
                          </>
                        ) : user.role}
                      </td>

                      <td style={tableCellStyle}>
                        {editingUserId === user._id ? (
                          <>
                            <input
                              type="text"
                              name="phone"
                              value={userEditData.phone || ""}
                              onChange={handleInputChange}
                              style={inputStyle(errors.phone)}
                            />
                            {errors.phone && <div style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.phone}</div>}
                          </>
                        ) : user.phone}
                      </td>

                      <td style={tableCellStyle}>
                        {editingUserId === user._id ? (
                          <>
                            <input
                              type="text"
                              name="address"
                              value={userEditData.address || ""}
                              onChange={handleInputChange}
                              style={inputStyle(errors.address)}
                            />
                            {errors.address && <div style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.address}</div>}
                          </>
                        ) : user.address}
                      </td>

                      <td style={{
                        ...tableCellStyle,
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap"
                      }}>
                        {editingUserId === user._id ? (
                          <>
                            <button onClick={handleSaveClick}
                              disabled={Object.values(errors).some((error) => error)}
                              style={{
                                backgroundColor: Object.values(errors).some((error) => error)
                                  ? "#6b7280" : "#10b981",
                                color: "white", border: "none", borderRadius: "4px", padding: "0.5rem", cursor: "pointer"
                              }}><FaCheck /></button>
                            <button onClick={handleCancelClick}
                              style={{
                                backgroundColor: "#ef4444", color: "white",
                                border: "none", borderRadius: "4px", padding: "0.5rem", cursor: "pointer"
                              }}><FaTimes /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEditClick(user)}
                              style={{
                                backgroundColor: "#3b82f6", color: "white",
                                border: "none", borderRadius: "4px", padding: "0.5rem", cursor: "pointer"
                              }}><FaPen /></button>
                            <button onClick={() => setConfirmDeleteId(user._id)}
                              style={{
                                backgroundColor: "#ef4444", color: "white",
                                border: "none", borderRadius: "4px", padding: "0.5rem", cursor: "pointer"
                              }}><FaTrash /></button>
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

      {confirmDeleteId && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)", display: "flex",
          justifyContent: "center", alignItems: "center", zIndex: 9999
        }}>
          <div style={{
            backgroundColor: "#1f2937", padding: "1.5rem",
            borderRadius: "8px", maxWidth: "90%", width: "400px",
            textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
          }}>
            <h3 style={{ color: "white", marginBottom: "1rem" }}>
              Are you sure you want to delete this user?
            </h3>
            <div>
              <button onClick={() => {
                handleDelete(confirmDeleteId);
                setConfirmDeleteId(null);
              }} style={{
                backgroundColor: "#ef4444", color: "white",
                border: "none", borderRadius: "4px", padding: "0.5rem 1rem",
                marginRight: "1rem", cursor: "pointer"
              }}>Yes, Delete</button>
              <button onClick={() => setConfirmDeleteId(null)} style={{
                backgroundColor: "#6b7280", color: "white",
                border: "none", borderRadius: "4px", padding: "0.5rem 1rem",
                cursor: "pointer"
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} newestOnTop />
    </section>
  );
};

export default UserList;
