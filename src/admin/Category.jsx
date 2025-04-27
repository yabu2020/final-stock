import React, { useState } from 'react';
import axios from 'axios';

function Category() {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); 
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate input
    if (!code || !description || !category) {
      setMessage('Please fill in all fields.');
      return;
    }

    // Get the branch manager ID from local storage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const branchManagerId = currentUser?._id;

    if (!branchManagerId) {
      setMessage("You must be logged in as a branch manager to register categories.");
      return;
    }

    // Create the payload with branchManagerId
    const payload = {
      code,
      description,
      category,
      branchManagerId, // Include the branch manager's ID
    };

    // Send data to the backend
    axios.post('http://localhost:3001/category', payload)
      .then(response => {
        setMessage('Category registered successfully.');
        setCode('');
        setDescription('');
        setCategory(''); // Reset category
      })
      .catch(error => {
        setMessage(`Error: ${error.response ? error.response.data.error : error.message}`);
      });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div
        className="w-full max-w-xl p-8 rounded-lg shadow-lg"
        style={{ maxWidth: '500px', backgroundColor: '#1c1c2e' }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">Set Category</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap -mx-3 mb-6">
            {/* Category Name Field */}
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="category" className="block ml-0 font-medium text-gray-300 mb-1">
                Category Name:
              </label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Code Field */}
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="code" className="block font-medium text-gray-300 mb-1">
                Code:
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block font-medium text-gray-300 mb-1">
              Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-500 transition duration-300"
            >
              Register Category
            </button>
          </div>

          {/* Success/Error Message */}
          {message && (
            <p
              className={`text-sm mt-4 text-center ${
                message.includes("successfully") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Category;