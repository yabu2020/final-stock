import React, { useState, useEffect } from "react";
import axios from "axios";

function CreateBranch({ setBranches }) {
  const [branchName, setBranchName] = useState("");
  const [location, setLocation] = useState("");
  const [managers, setManagers] = useState([]);
  const [managerId, setManagerId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:3001/users?role=manager"),
      axios.get("http://localhost:3001/branches"),
    ])
      .then(([managersResponse, branchesResponse]) => {
        console.log("Managers response:", managersResponse.data);
        console.log("Branches response:", branchesResponse.data);
  
        // Extract assigned manager IDs
        const assignedManagerIds = branchesResponse.data
          .map(branch => branch.manager?._id || branch.manager) // Handle both object and string formats
          .filter(id => id); // Filter out null or undefined values
        console.log("Assigned manager IDs:", assignedManagerIds);
  
        // Filter available managers
        const availableManagers = managersResponse.data
          .filter(manager => manager.role === "manager") // Ensure only managers are included
          .filter(manager => !assignedManagerIds.includes(manager._id)); // Exclude assigned managers
        console.log("Available managers:", availableManagers);
  
        setManagers(availableManagers);
      })
      .catch(err => console.error("Error fetching managers or branches", err));
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
  
    if (!branchName || !location) {
      setError("Branch name and location are required.");
      return;
    }
  
    axios.post("http://localhost:3001/addbranch", { branchName, location, managerId })
      .then(response => {
        if (response.status === 201) {
          setBranches(prev => [...prev, response.data]); // Update branches list
          alert("Branch created successfully!");
          setBranchName("");
          setLocation("");
          setManagerId("");
        } else {
          setError("Unexpected response from server. Please try again.");
        }
      })
      .catch(err => {
        console.error("Error response:", err);
        if (err.response) {
          if (err.response.data.error === "This manager is already assigned to another branch") {
            setError("This manager is already assigned to another branch.");
          } else {
            setError(err.response.data?.error || "Error creating branch");
          }
        } else if (err.request) {
          setError("No response from server. Please check your connection.");
        } else {
          setError("An unexpected error occurred.");
        }
      });
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-400">Create Branch</h2>
        {error && <p className="text-red-500">{error}</p>}
        {managers.length === 0 && (
          <p className="text-red-500 mb-4">
            No available managers. All managers are already assigned to branches.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Branch Name Field */}
          <div>
            <label htmlFor="branchName" className="block font-medium text-gray-600 mb-1">Branch Name:</label>
            <input
              type="text"
              id="branchName"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-100 border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          {/* Location Field */}
          <div>
            <label htmlFor="location" className="block font-medium text-gray-600 mb-1">Location:</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-100 border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          {/* Manager Dropdown */}
          <div>
            <label htmlFor="manager" className="block font-medium text-gray-600 mb-1">Manager:</label>
            <select
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            >
              <option value="">Select Manager</option>
              {managers.length > 0 ? (
                managers.map(manager => (
                  <option key={manager._id} value={manager._id}>
                    {manager.name}
                  </option>
                ))
              ) : (
                <option disabled>No available managers</option>
              )}
            </select>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 py-2 px-4 text-white rounded-md shadow hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Branch
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBranch;
