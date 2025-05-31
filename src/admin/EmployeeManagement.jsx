import React, { useState } from "react";
import axios from "axios";

function EmployeeManagement() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = () => {
    const newErrors = {};
  
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = "Name must contain only letters";
    }
  
    if (!phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^(09|07)\d{8}$/.test(phone)) {
      newErrors.phone = "Phone must be 10 digits and start with 09 or 07";
    }
  
    if (!address.trim()) {
      newErrors.address = "Address is required";
    } else if (/^\d+$/.test(address)) {
      newErrors.address = "Address cannot be numbers only";
    }
  
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
  
    return newErrors;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validate();
    setErrors(fieldErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const fieldErrors = validate();
    setErrors(fieldErrors);
    setTouched({ name: true, phone: true, address: true, password: true });

    if (Object.keys(fieldErrors).length > 0) {
      setFormError("Please fix the errors before submitting.");
      return;
    }

    try {
      await axios.post("http://localhost:3001/addemployee", {
        name,
        phone,
        address,
        role,
        password,
      });
      alert("Employee added successfully!");
      setName("");
      setPhone("");
      setAddress("");
      setPassword("");
      setFormError("");
      setErrors({});
      setTouched({});
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.error === "Duplicate phone"
      ) {
        setFormError("Phone number already exists");
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.error
      ) {
        setFormError(err.response.data.error);
      } else {
        setFormError("Error adding employee");
      }
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => handleBlur("name")}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            />
            {touched.name && errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => handleBlur("phone")}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            />
            {touched.phone && errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Address
            </label>
            <input
              id="address"
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={() => handleBlur("address")}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            />
            {touched.address && errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-1">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

        </div>

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
        >
          Add Employee
        </button>

        {formError && <p className="text-red-500 mt-4">{formError}</p>}
      </form>
    </div>
  );
}

export default EmployeeManagement;
