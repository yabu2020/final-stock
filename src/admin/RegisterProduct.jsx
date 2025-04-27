// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function RegisterProduct() {
//   const [name, setName] = useState('');
//   const [purchaseprice, setPurchaseprice] = useState('');
//   const [saleprice, setSaleprice] = useState(''); // Changed to saleprice
//   const [quantity, setQuantity] = useState('');
//   const [description, setDescription] = useState('');
//   const [status, setStatus] = useState('Available');
//   const [category, setCategory] = useState('');
//   const [categories, setCategories] = useState([]);
//   const [quantityType, setQuantityType] = useState('whole');
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     axios.get('http://localhost:3001/categories')
//       .then(response => setCategories(response.data))
//       .catch(error => {
//         console.error('Error fetching categories:', error);
//         setMessage('Error fetching categories.');
//       });
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
  
//     if (!name  || !quantity || !purchaseprice || !saleprice || !category) {
//       setMessage('Please fill in all fields.');
//       return;
//     }
  
//     // Validate numeric values
//     const purchasePrice = parseFloat(purchaseprice);
//     const salePrice = parseFloat(saleprice);
  
//     if (isNaN(purchasePrice) || isNaN(salePrice)) {
//       setMessage('Purchase price and sale price must be valid numbers.');
//       return;
//     }
  
//     let warningMessage = '';
//     if (salePrice < purchasePrice) {
//       warningMessage = 'Warning: Sale price is less than purchase price.';
//     }
  
//     const productInstances = [];
//     if (quantityType === 'whole') {
//       productInstances.push({
//         name,
//         description,
//         purchaseprice,
//         saleprice,
//         status,
//         category,
//         quantity: parseInt(quantity, 10)
//       });
//     } else if (quantityType === 'pieces') {
//       for (let i = 0; i < parseInt(quantity, 10); i++) {
//         productInstances.push({
//           name,
//           description,
//           purchaseprice,
//           saleprice,
//           status,
//           category
//         });
//       }
//     }
  
//     axios.post('http://localhost:3001/registerproduct', productInstances)
//       .then(response => {
//         setMessage(`Products registered successfully. ${warningMessage}`);
//         setName('');
//         setQuantity('');
//         setPurchaseprice('');
//         setSaleprice('');
//         setDescription('');
//         setStatus('Available');
//         setCategory('');
//         setQuantityType('whole');
//       })
//       .catch(error => {
//         setMessage(`Error: ${error.response ? error.response.data.error : error.message}`);
//       });
//   };
  

//   return (
//     <div className="flex items-center justify-center">
//       <div className="w-full max-w-lg ml-20 p-8 rounded-lg shadow-lg" style={{ maxWidth: '780px' }}>
//         <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">Register Product</h1>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {message && <p className="text-blue-400 text-sm mt-4">{message}</p>}
//           <div className="flex flex-wrap -mx-3 mb-6">
//             <div className="w-full md:w-1/2 px-3">
//               <label htmlFor="name" className="block ml-0 font-medium text-gray-600 mb-1">Product Name:</label>
//               <input
//                 type="text"
//                 id="name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 className="w-full px-3 ml-0 bg-gray-100 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
//               />
//             </div>
//             <div className="w-full md:w-1/2 px-3">
//               <label htmlFor="quantity" className="block ml-0 font-medium text-gray-600 mb-1">Quantity:</label>
//               <input
//                 type="text"
//                 id="quantity"
//                 value={quantity}
//                 onChange={(e) => setQuantity(e.target.value)}
//                 required
//                 className="w-full px-3 py-2 ml-0 bg-gray-100 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-700 border-gray-300"
//               />
//             </div>
//           </div>

//           <div className="flex flex-wrap -mx-3 mb-6">
//             <div className="w-full md:w-1/2 px-3">
//               <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category:</label>
//               <select
//                 id="category"
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 required
//                 className="w-full px-3 py-2 border bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 border-blue-300"
//               >
//                 <option value="">Select a category</option>
//                 {categories.map(cat => (
//                   <option key={cat._id} value={cat._id}>
//                     {cat.category} (Code: {cat.code})
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="w-full md:w-1/2 px-3">
//               <label htmlFor="purchaseprice" className="block font-medium text-gray-600 mb-1">Pur Price:</label>
//               <input
//                 type="text"
//                 id="purchaseprice"
//                 value={purchaseprice}
//                 onChange={(e) => setPurchaseprice(e.target.value)}
//                 required
//                 className="w-full px-3 py-2 bg-gray-100 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
//               />
//             </div>
//           </div>
//           <div className="flex flex-wrap -mx-3 mb-6">
//             <div className="w-full md:w-1/2 px-3">
//               <label htmlFor="saleprice" className="block font-medium text-gray-600 mb-1">Sale Price:</label>
//               <input
//                 type="text"
//                 id="saleprice"
//                 value={saleprice}
//                 onChange={(e) => setSaleprice(e.target.value)}
//                 required
//                 className="w-full px-3 py-2 bg-gray-100 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
//               />
//             </div>
//             <div className="w-full md:w-1/2 px-3">
//               <label htmlFor="description" className="block font-medium text-gray-600 mb-1">Description:</label>
//               <textarea
//                 id="description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="w-full px-3 py-2 bg-gray-100 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
//               />
//             </div>
//           </div>
//           <div className="flex flex-wrap -mx-3 mb-6">
//             <div className="w-full md:w-1/2 px-3">
//               <label htmlFor="status" className="block font-medium text-gray-600 mb-1">Status:</label>
//               <select
//                 id="status"
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 className="w-full px-3 py-2 bg-gray-200 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-300"
//               >
//                 <option value="Available">Available</option>
//                 <option value="Low Stock">Low Stock</option>
//               </select>
//             </div>

//             <div className="w-full md:w-1/2 px-3">
//               <label htmlFor="quantityType" className="block font-medium text-gray-600 mb-1">Quantity Type:</label>
//               <select
//                 id="quantityType"
//                 value={quantityType}
//                 onChange={(e) => setQuantityType(e.target.value)}
//                 className="w-full px-3 py-2 bg-gray-200 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-300"
//               >
//                 <option value="whole">Whole Units</option>
//                 <option value="pieces">Individual Pieces</option>
//               </select>
//             </div>
//           </div>
//           <div className="w-full ml-20 md:w-1/2 px-3">
//             <button
//               type="submit"
//               className="w-full mt-2 bg-blue-400 py-2 px-4 text-gray rounded-md shadow hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             >
//               Register Product
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default RegisterProduct;


import React, { useState, useEffect } from "react";
import axios from "axios";

function RegisterProduct() {
  const [name, setName] = useState("");
  const [purchaseprice, setPurchaseprice] = useState("");
  const [saleprice, setSaleprice] = useState(""); // Changed to saleprice
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Available");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [quantityType, setQuantityType] = useState("whole");
  const [image, setImage] = useState(null); // State for the uploaded image
  const [message, setMessage] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const branchManagerId = currentUser?._id;

    if (!branchManagerId) {
      setMessage("You must be logged in as a branch manager to register products.");
      return;
    }

    axios
      .get("http://localhost:3001/categories", {
        params: { branchManagerId }, // Pass branchManagerId as a query parameter
      })
      .then((response) => setCategories(response.data))
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setMessage("Error fetching categories.");
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !quantity || !purchaseprice || !saleprice || !category || !image) {
      setMessage("Please fill in all fields and upload an image.");
      return;
    }

    // Validate numeric values
    const parsedQuantity = parseInt(quantity, 10);
    const purchasePrice = parseFloat(purchaseprice);
    const salePrice = parseFloat(saleprice);

    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setMessage("Quantity must be a positive number.");
      return;
    }

    if (isNaN(purchasePrice) || purchasePrice <= 0) {
      setMessage("Purchase price must be a positive number.");
      return;
    }

    if (isNaN(salePrice) || salePrice <= 0) {
      setMessage("Sale price must be a positive number.");
      return;
    }

    let warningMessage = "";
    if (salePrice < purchasePrice) {
      warningMessage = "Warning: Sale price is less than purchase price.";
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Get the logged-in user
    const branchManagerId = currentUser?._id; // Extract the branch manager's ID

    if (!branchManagerId) {
      setMessage("You must be logged in as a branch manager to register products.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("purchaseprice", purchasePrice);
    formData.append("saleprice", salePrice);
    formData.append("status", status);
    formData.append("category", category);
    formData.append("quantity", parsedQuantity);
    formData.append("branchManagerId", branchManagerId);
    formData.append("image", image); // Append the image file

    axios
      .post("http://localhost:3001/registerproduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      })
      .then((response) => {
        setMessage(`Products registered successfully. ${warningMessage}`);
        setName("");
        setQuantity("");
        setPurchaseprice("");
        setSaleprice("");
        setDescription("");
        setStatus("Available");
        setCategory("");
        setQuantityType("whole");
        setImage(null); // Clear the image state
      })
      .catch((error) => {
        setMessage(`Error: ${error.response ? error.response.data.error : error.message}`);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div
        className="w-full max-w-lg p-8 rounded-lg shadow-lg"
        style={{ maxWidth: "780px", backgroundColor: "#1c1c2e" }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">
          Register Product
        </h1>

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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Product Name & Quantity */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                htmlFor="name"
                className="block font-medium text-gray-300 mb-1"
              >
                Product Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                htmlFor="quantity"
                className="block font-medium text-gray-300 mb-1"
              >
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
          </div>

          {/* Row 2: Category & Purchase Price */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                htmlFor="category"
                className="block font-medium text-gray-300 mb-1"
              >
                Category:
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.category} (Code: {cat.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                htmlFor="purchaseprice"
                className="block font-medium text-gray-300 mb-1"
              >
                Purchase Price:
              </label>
              <input
                type="number"
                id="purchaseprice"
                value={purchaseprice}
                onChange={(e) => setPurchaseprice(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
          </div>

          {/* Row 3: Sale Price & Description */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                htmlFor="saleprice"
                className="block font-medium text-gray-300 mb-1"
              >
                Sale Price:
              </label>
              <input
                type="number"
                id="saleprice"
                value={saleprice}
                onChange={(e) => setSaleprice(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                htmlFor="description"
                className="block font-medium text-gray-300 mb-1"
              >
                Description:
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
          </div>

          {/* Row 4: Status & Quantity Type */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                htmlFor="status"
                className="block font-medium text-gray-300 mb-1"
              >
                Status:
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              >
                <option value="Available">Available</option>
                <option value="Low Stock">Low Stock</option>
              </select>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                htmlFor="quantityType"
                className="block font-medium text-gray-300 mb-1"
              >
                Quantity Type:
              </label>
              <select
                id="quantityType"
                value={quantityType}
                onChange={(e) => setQuantityType(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              >
                <option value="whole">Whole Units</option>
                <option value="pieces">Individual Pieces</option>
              </select>
            </div>
          </div>

          {/* Row 5: Product Image */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                htmlFor="image"
                className="block font-medium text-gray-300 mb-1"
              >
                Product Image:
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-500 transition duration-300"
            >
              Register Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterProduct;