import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons

function Createuser({ setUsers }) {
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState(""); // New state for general form errors
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const validatePhone = (phone) => {
    const re = /^(09|07)\d{8}$/;
    return re.test(phone);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return re.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setNameError("");
    setPhoneError("");
    setAddressError("");
    setPasswordError("");
    setFormError(""); // Clear general form error

    if (!name) {
      setNameError("Name is required");
      return;
    }
    if (!phone) {
      setPhoneError("Phone number is required");
      return;
    }
    if (!validatePhone(phone)) {
      setPhoneError("Phone number must start with 09 or 07 and be 10 digits long");
      return;
    }
    if (!address) {
      setAddressError("Address is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters long and include letters and numbers");
      return;
    }

    axios
      .post("http://localhost:3001/adduser", { role, name, phone, password, address })
      .then((result) => {
        setUsers(prevUsers => [...prevUsers, result.data]);
        alert("User added successfully!");
        setName("");
        setPhone("");
        setPassword("");
        setAddress("");
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error) {
          setFormError(err.response.data.error); // Set general form error
        } else {
          console.log(err);
          setFormError("Error adding user");
        }
      });
  };

  return (
    <div className="flex items-center ml-20 justify-center bg-gray-900 min-h-screen dark:bg-gray-900">
      <div className="w-full p-8 rounded-lg shadow-lg" style={{ maxWidth: '600px', backgroundColor: '#1f2937' }}>
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-400 dark:text-blue-400">Create User</h2>
        {formError && <p className="text-red-500 mb-4 text-center">{formError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-3 mr-20 mb-6">
            {/* Name Field */}
            <div className="w-full md:w-1/2 px-3">
              <label className="block font-bold mb-2 text-gray-300 dark:text-gray-300" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-400 border ${nameError ? 'border-red-500' : 'border-gray-600'} dark:bg-gray-700 dark:text-white`}
              />
              {nameError && <p className="text-red-500 mt-2">{nameError}</p>}
            </div>

            {/* Phone Field */}
            <div className="w-full md:w-1/2 px-3">
              <label className="block font-bold mb-2 text-gray-300 dark:text-gray-300" htmlFor="phone">
                Phone
              </label>
              <input
                type="text"
                placeholder="Enter Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-400 border ${phoneError ? 'border-red-500' : 'border-gray-600'} dark:bg-gray-700 dark:text-white`}
              />
              {phoneError && <p className="text-red-500 mt-2">{phoneError}</p>}
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mr-20 mb-6">
            {/* Password Field */}
            <div className="w-full md:w-1/2 px-3">
              <label className="block font-bold mb-2 text-gray-300 dark:text-gray-300" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-400 border ${passwordError ? 'border-red-500' : 'border-gray-600'} dark:bg-gray-700 dark:text-white`}
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400 dark:text-gray-400" />
                  ) : (
                    <FaEye className="text-gray-400 dark:text-gray-400" />
                  )}
                </div>
              </div>
              {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
            </div>

            {/* Address Field */}
            <div className="w-full md:w-1/2 px-3">
              <label className="block font-bold mb-2 text-gray-300 dark:text-gray-300" htmlFor="address">
                Address
              </label>
              <input
                type="text"
                placeholder="Enter Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-400 border ${addressError ? 'border-red-500' : 'border-gray-600'} dark:bg-gray-700 dark:text-white`}
              />
              {addressError && <p className="text-red-500 mt-2">{addressError}</p>}
            </div>
          </div>

          {/* Role Dropdown */}
          <div className="mb-4">
            <label className="block font-bold mb-2 text-gray-300 dark:text-gray-300" htmlFor="role">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-400 border border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="user">User</option>
              <option value="Admin">Admin</option>
              <option value="manager">Branch Manager</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="mb-4 w-full md:w-1/2 ml-40 px-3">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Createuser;