import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

function CreateBranch({ setBranches }) {
  const [branchName, setBranchName] = useState("");
  const [location, setLocation] = useState("");
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [errors, setErrors] = useState({
    branchName: "",
    location: "",
    manager: ""
  });
  const [touched, setTouched] = useState({
    branchName: false,
    location: false,
    manager: false
  });

  const validateBranchName = (name) => {
    if (!name.trim()) return "Branch name is required";
    if (/^\d+$/.test(name.trim())) return "Branch name cannot be only numbers";
    if (!/^[a-zA-Z0-9\s]+$/.test(name.trim())) return "Only letters and numbers allowed";
    return "";
  };

  const validateLocation = (loc) => {
    if (!loc.trim()) return "Location is required";
    if (/^\d+$/.test(loc.trim())) return "Location cannot be only numbers";
    if (!/[a-zA-Z]/.test(loc.trim())) return "Location must contain letters";
    return "";
  };

  const validateManager = (manager) => {
    if (!manager) return "Please select a branch manager";
    return "";
  };

  useEffect(() => {
    if (touched.branchName) {
      setErrors(prev => ({
        ...prev,
        branchName: validateBranchName(branchName)
      }));
    }
  }, [branchName, touched.branchName]);

  useEffect(() => {
    if (touched.location) {
      setErrors(prev => ({
        ...prev,
        location: validateLocation(location)
      }));
    }
  }, [location, touched.location]);

  useEffect(() => {
    if (touched.manager) {
      setErrors(prev => ({
        ...prev,
        manager: validateManager(selectedManager)
      }));
    }
  }, [selectedManager, touched.manager]);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'manager') {
      setErrors(prev => ({
        ...prev,
        manager: validateManager(selectedManager)
      }));
    }
  };

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:3001/users?role=manager"),
      axios.get("http://localhost:3001/branches"),
    ])
      .then(([managersResponse, branchesResponse]) => {
        const assignedManagerIds = branchesResponse.data
          .map(branch => branch.manager?._id || branch.manager)
          .filter(Boolean);

        const availableManagers = managersResponse.data
          .filter(manager => manager.role === "manager")
          .filter(manager => !assignedManagerIds.includes(manager._id));

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
    
    setTouched({
      branchName: true,
      location: true,
      manager: true
    });

    const validationErrors = {
      branchName: validateBranchName(branchName),
      location: validateLocation(location),
      manager: validateManager(selectedManager)
    };

    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some(error => error);
    if (hasErrors) return;

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
        setTouched({
          branchName: false,
          location: false,
          manager: false
        });
      }
    })
    .catch(err => {
      console.error("Error response:", err);
      if (err.response) {
        if (err.response.data.error === "This manager is already assigned to another branch") {
          setErrors(prev => ({ ...prev, manager: "This manager is already assigned to another branch." }));
        } else {
          setErrors(prev => ({ ...prev, form: err.response.data?.error || "Error creating branch" }));
        }
      } else if (err.request) {
        setErrors(prev => ({ ...prev, form: "No response from server. Please check your connection." }));
      } else {
        setErrors(prev => ({ ...prev, form: "An unexpected error occurred." }));
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-lg shadow-lg bg-gray-800 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">Create Branch</h2>

        {errors.form && <p className="text-red-400 mb-4 text-center">{errors.form}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="branchName" className="block mb-1 font-medium text-gray-300">
              Branch Name:
            </label>
            <input
              type="text"
              id="branchName"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              onBlur={() => handleBlur("branchName")}
              className={`w-full px-3 py-2 rounded-md bg-gray-700 border ${
                errors.branchName && touched.branchName ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 text-white`}
              placeholder="Enter branch name"
            />
            {errors.branchName && touched.branchName && (
              <p className="text-red-400 text-sm mt-1">{errors.branchName}</p>
            )}
          </div>

          <div>
            <label htmlFor="location" className="block mb-1 font-medium text-gray-300">
              Location:
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onBlur={() => handleBlur("location")}
              className={`w-full px-3 py-2 rounded-md bg-gray-700 border ${
                errors.location && touched.location ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 text-white`}
              placeholder="Enter location"
            />
            {errors.location && touched.location && (
              <p className="text-red-400 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-300">
              Branch Manager:
            </label>
            <Select
              options={managers}
              value={selectedManager}
              onChange={setSelectedManager}
              onBlur={() => handleBlur("manager")}
              placeholder="Select a manager..."
              isClearable
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  backgroundColor: "#374151",
                  borderColor: errors.manager && touched.manager ? "#EF4444" : "#4B5563",
                  color: "white",
                  boxShadow: state.isFocused && !errors.manager ? "0 0 0 1px #3B82F6" : "none",
                }),
                input: (provided) => ({
                  ...provided,
                  color: "white",
                  opacity: 1,
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
            {errors.manager && touched.manager && (
              <p className="text-red-400 text-sm mt-1">{errors.manager}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-600 rounded-md text-white font-semibold hover:bg-blue-500 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
            disabled={
              (touched.branchName && errors.branchName) ||
              (touched.location && errors.location) ||
              (touched.manager && errors.manager) ||
              !branchName ||
              !location ||
              !selectedManager
            }
          >
            Add Branch
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBranch;