import React, { useState, useEffect } from "react";
import axios from "axios";

function CreateBranch({ setBranches }) {
  const [branchName, setBranchName] = useState("");
  const [location, setLocation] = useState("");
  const [managers, setManagers] = useState([]);
  const [filteredManagers, setFilteredManagers] = useState([]);
  const [managerId, setManagerId] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
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
          .map(branch => branch.manager?._id || branch.manager)
          .filter(id => id);
        console.log("Assigned manager IDs:", assignedManagerIds);

        // Filter available managers
        const availableManagers = managersResponse.data
          .filter(manager => manager.role === "manager")
          .filter(manager => !assignedManagerIds.includes(manager._id));
        console.log("Available managers:", availableManagers);

        setManagers(availableManagers);
        setFilteredManagers(availableManagers); // Initialize filtered list
      })
      .catch(err => console.error("Error fetching managers or branches", err));
  }, []);

  useEffect(() => {
    // Filter managers based on search query
    const filtered = managers.filter(manager =>
      manager.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredManagers(filtered);
  }, [managers, searchQuery]);

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
          // Update branches list only if setBranches is a function
          if (typeof setBranches === "function") {
            setBranches(prev => [...prev, response.data]);
          }
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
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-gray-800 text-white">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-400">Create Branch</h2>

        {error && (
          <p className="text-red-400 mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Branch Name Field */}
          <div>
            <label htmlFor="branchName" className="block font-medium text-gray-300 mb-1">Branch Name:</label>
            <input
              type="text"
              id="branchName"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-700 border-gray-600 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location Field */}
          <div>
            <label htmlFor="location" className="block font-medium text-gray-300 mb-1">Location:</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-700 border-gray-600 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Manager Dropdown with Search */}
          <div className="relative">
            <label htmlFor="manager" className="block font-medium text-gray-300 mb-1">Manager:</label>
            <div className="flex items-center">
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search manager..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border-gray-600 rounded-l-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Dropdown Arrow */}
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </span>
            </div>

            {/* Manager Dropdown */}
            <select
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border-gray-600 rounded-r-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Manager</option>
              {filteredManagers.length > 0 ? (
                filteredManagers.map(manager => (
                  <option key={manager._id} value={manager._id}>
                    {manager.name}
                  </option>
                ))
              ) : (
                <option disabled>No results found</option>
              )}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 py-2 px-4 text-white rounded-md shadow hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Branch
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBranch;