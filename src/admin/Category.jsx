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
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-xl p-8 rounded-lg shadow-lg" style={{ maxWidth: '500px' }}>
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">Set Category</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="category" className="block ml-0 font-medium text-gray-600 mb-1">Category Name:</label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-3 ml-0 bg-gray-100 py-2  border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="code" className="block font-medium text-gray-600 mb-1">Code:</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-100  border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block font-medium text-gray-600 mb-1">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 border  border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="w-full ml-20 md:w-1/2 px-3">
            <button
              type="submit"
              className="w-full mt-2 bg-blue-500 py-2 px-4 text-black rounded-md shadow hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register Category
            </button>
          </div>  
          {message && <p className="text-green-400 text-sm mt-4">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default Category;