// UserList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userEditData, setUserEditData] = useState({});

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
      .then((response) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === editingUserId ? response.data : user
          )
        );
        setEditingUserId(null);
        setUserEditData({});
      })
      .catch((err) => console.log("Error updating user", err));
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
        alert("User deleted successfully!");
      })
      .catch((err) => console.log("Error deleting user", err));
  };

  const tableHeaderStyle = {
    backgroundColor: "#2d3748",
    color: "white",
    padding: "0.5rem",
    textAlign: "left",
  };

  const tableCellStyle = {
    padding: "0.5rem",
    borderBottom: "1px solid #4a5568",
    color: "white",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #4a5568",
    backgroundColor: "#1f2937",
    color: "white",
  };

  return (
    <section style={{ backgroundColor: "#1f2937", padding: "1rem" }}>
      <div style={{ marginLeft: "60px", marginTop: "2rem" }}>
        <div
          style={{
            backgroundColor: "#1c1c2e",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
          }}
        >
          {/* Header Section */}
          <div style={{ padding: "1rem", borderBottom: "1px solid #4a5568" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ color: "white", fontSize: "1.5rem", fontWeight: "bold" }}>
                List of Users
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
              >
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Name</th>
                    <th style={tableHeaderStyle}>Role</th>
                    <th style={tableHeaderStyle}>Phone</th>
                    <th style={tableHeaderStyle}>Address</th>
                    <th style={tableHeaderStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user._id}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#1c1c2e" : "#1f2937",
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2d3748")}
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          index % 2 === 0 ? "#1c1c2e" : "#1f2937")
                      }
                    >
                      <td style={tableCellStyle}>
                        {editingUserId === user._id ? (
                          <input
                            type="text"
                            name="name"
                            value={userEditData.name || ""}
                            onChange={handleInputChange}
                            style={inputStyle}
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
                            style={inputStyle}
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
                            style={inputStyle}
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
                            style={inputStyle}
                          />
                        ) : (
                          user.address
                        )}
                      </td>
                      <td style={tableCellStyle}>
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
                              Save
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
                              Cancel
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
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              style={{
                                backgroundColor: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "0.5rem",
                                cursor: "pointer",
                              }}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserList;