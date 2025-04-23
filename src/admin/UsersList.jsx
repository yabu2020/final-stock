import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

function UsersList() {
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

  return (
    <section className="py-1 bg-gray-900">
      <div className="w-full xl:w-10/12 mb-12 xl:mb-0 px-4 ml-60 mt-8"> {/* Reduced top margin */}
        <div className="relative flex flex-col min-w-0 break-words bg-gray-800 w-full mb-6 shadow-lg rounded-lg overflow-hidden">
          <div className="mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-xl text-white">List of Users</h3>
              </div>
              <div className="flex-grow self-end text-right">
                <Link to="/adduser">
                  <button className="bg-blue-400 w-28 h-11 justify-around hover:text-blue items-center hover:bg-blue-300 text-white">
                    New User
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="block w-full overflow-x-auto">
            <table className="items-center bg-transparent w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-6 bg-gray-800 text-white align-middle border border-solid border-gray-700 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Name
                  </th>
                  <th className="px-6 bg-gray-800 text-white align-middle border border-solid border-gray-700 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Role
                  </th>
                  <th className="px-6 bg-gray-800 text-white align-middle border border-solid border-gray-700 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Phone
                  </th>
                  <th className="px-6 bg-gray-800 text-white align-middle border border-solid border-gray-700 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Address
                  </th>
                  <th className="px-6 bg-gray-800 text-white align-middle border border-solid border-gray-700 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`border-b border-gray-700 ${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-white border-t-0 border-l-0 border-r-0 align-middle whitespace-nowrap">
                      {editingUserId === user._id ? (
                        <input
                          type="text"
                          name="name"
                          value={userEditData.name || ""}
                          onChange={handleInputChange}
                          className="border p-1 bg-gray-700 text-white"
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-white border-t-0 border-l-0 border-r-0 align-middle whitespace-nowrap">
                      {editingUserId === user._id ? (
                        <input
                          type="text"
                          name="role"
                          value={userEditData.role || ""}
                          onChange={handleInputChange}
                          className="border p-1 bg-gray-700 text-white"
                        />
                      ) : (
                        user.role
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-white border-t-0 border-l-0 border-r-0 align-middle whitespace-nowrap">
                      {editingUserId === user._id ? (
                        <input
                          type="text"
                          name="phone"
                          value={userEditData.phone || ""}
                          onChange={handleInputChange}
                          className="border p-1 bg-gray-700 text-white"
                        />
                      ) : (
                        user.phone
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-white border-t-0 border-l-0 border-r-0 align-middle whitespace-nowrap">
                      {editingUserId === user._id ? (
                        <input
                          type="text"
                          name="address"
                          value={userEditData.address || ""}
                          onChange={handleInputChange}
                          className="border p-1 bg-gray-700 text-white"
                        />
                      ) : (
                        user.address
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-white border-t-0 border-l-0 border-r-0 align-middle whitespace-nowrap">
                      {editingUserId === user._id ? (
                        <>
                          <button onClick={handleSaveClick} className="text-green-500 hover:text-green-700 mr-4">
                            Save
                          </button>
                          <button onClick={handleCancelClick} className="text-red-500 hover:text-red-700">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <FaEdit
                            className="hover:text-blue-700 hover:cursor-pointer mr-4"
                            onClick={() => handleEditClick(user)}
                          />
                          <FaTrash
                            className="hover:text-red-500 hover:cursor-pointer"
                            onClick={() => handleDelete(user._id)}
                          />
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
    </section>
  );
}

export default UsersList;