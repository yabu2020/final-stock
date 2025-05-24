import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

function CreateBranch({ setBranches }) {
  const [branchName, setBranchName] = useState("");
  const [location, setLocation] = useState("");
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:3001/users?role=manager"),
      axios.get("http://localhost:3001/branches"),
    ])
      .then(([managersResponse, branchesResponse]) => {
        // Get assigned manager IDs
        const assignedManagerIds = branchesResponse.data
          .map(branch => branch.manager?._id || branch.manager)
          .filter(Boolean);

        // Filter out assigned managers
        const availableManagers = managersResponse.data
          .filter(manager => manager.role === "manager")
          .filter(manager => !assignedManagerIds.includes(manager._id));

        // Map to react-select options
        const options = availableManagers.map(manager => ({
          value: manager._id,
          label: manager.name,
        }));

        setManagers(options);
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

    if (!selectedManager) {
      setError("Please select a branch manager.");
      return;
    }

    axios.post("http://localhost:3001/addbranch", {
      branchName,
      location,
      managerId: selectedManager.value,
    })
    .then(response => {
      if (response.status === 201) {
        if (typeof setBranches === "function") {
          setBranches(prev => [...prev, response.data]);
        }
        alert("Branch created successfully!");
        setBranchName("");
        setLocation("");
        setSelectedManager(null);
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
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-gray-800 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">Create Branch</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Branch Name */}
          <div>
            <label htmlFor="branchName" className="block mb-1 font-medium text-gray-300">Branch Name:</label>
            <input
              type="text"
              id="branchName"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Enter branch name"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block mb-1 font-medium text-gray-300">Location:</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Enter location"
            />
          </div>

          {/* Manager Select */}
          <div>
            <label className="block mb-1 font-medium text-gray-300">Branch Manager:</label>
            <Select
              options={managers}
              value={selectedManager}
              onChange={setSelectedManager}
              placeholder="Select a manager..."
              isClearable
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: "#374151", // Tailwind bg-gray-700
                  borderColor: "#4B5563", // Tailwind border-gray-600
                  color: "white",
                }),
                input: (provided) => ({
                  ...provided,
                  color: "white",           // Make typed text white
                  opacity: 1,               // ensure visibility
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: "#374151",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "white",
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused ? "#2563EB" : "#374151",
                  color: "white",
                  cursor: "pointer",
                }),
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-600 rounded-md text-white font-semibold hover:bg-blue-500 transition"
          >
            Add Branch
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBranch;
