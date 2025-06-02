import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (userId) {
      fetchUserProfile(userId);
    }
  }, [userId]);

  const fetchUserProfile = (userId) => {
    axios.get(`http://localhost:3001/users/${userId}`)
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error("Error fetching user profile:", error);
        setError("Failed to load profile");
      });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      phone: "",
    };

    if (!/^[a-zA-Z\s]+$/.test(user.name)) {
      newErrors.name = "Name should contain only letters";
      valid = false;
    }

    if (!/^(09|07)\d{8}$/.test(user.phone)) {
      newErrors.phone = "Phone must start with 09 or 07 and be 10 digits";
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!validateForm()) {
      return;
    }

    axios.put(`http://localhost:3001/users/${userId}`, user)
      .then(response => {
        if (response.data) {
          setMessage(response.data.message || "Profile updated successfully!");
          setTimeout(() => navigate(-1), 2000);
        } else {
          setError("Failed to update profile (no response data)");
        }
      })
      .catch(error => {
        console.error("Error updating profile:", error);
        const errorMsg = error.response?.data?.message || 
                        error.message || 
                        "Failed to update profile";
        setError(errorMsg);
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-blue-400 mb-6">Edit Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-300 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            className={`w-full p-3 bg-gray-800 border ${
              formErrors.name ? "border-red-500" : "border-gray-600"
            } rounded-md text-white`}
          />
          {formErrors.name && (
            <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
          )}
        </div>
        
        <div>
          <label className="block text-lg font-medium text-gray-300 mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={user.phone}
            onChange={handleInputChange}
            className={`w-full p-3 bg-gray-800 border ${
              formErrors.phone ? "border-red-500" : "border-gray-600"
            } rounded-md text-white`}
            placeholder="09xxxxxxxx or 07xxxxxxxx"
          />
          {formErrors.phone && (
            <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
          )}
        </div>
        
        <div>
          <label className="block text-lg font-medium text-gray-300 mb-2">Address</label>
          <textarea
            name="address"
            value={user.address}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white"
            rows="3"
          />
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="py-3 px-6 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition-colors"
          >
            Update Profile
          </button>
        </div>
        
        {message && (
          <div className="p-3 bg-green-100 text-green-800 rounded-md mt-4">
            {message}
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-100 text-red-800 rounded-md mt-4">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

export default EditProfilePage;