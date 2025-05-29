// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

// function Login({ setCuser }) {
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [nameError, setNameError] = useState("");
//   const [passwordError, setPasswordError] = useState("");
//   const [showPassword, setShowPassword] = useState(false); // State for password visibility
//   const [tooltip, setTooltip] = useState(""); // State for tooltip text
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Reset errors
//     setNameError("");
//     setPasswordError("");

//     // Basic validation
//     let hasError = false;

//     if (!name) {
//       setNameError("Name is required");
//       hasError = true;
//     }
//     if (!password) {
//       setPasswordError("Password is required");
//       hasError = true;
//     }

//     if (hasError) return; // Prevent form submission if there are errors

//     axios
//       .post("http://localhost:3001", { name, password })
//       .then((result) => {
//         const response = result.data;
//         if (response[0] === "good") {
//           const userData = response[1];
//           setCuser(userData); // Set current user
//           // Redirect based on role
//           switch (userData.role) {
//             case "Admin":
//               navigate("/admin"); // Redirect admin to dashboard
//               break;
//             case "user":
//               navigate(`/userpage/${userData._id}`); // Redirect user to user page 
//               break;
//             case "Clerk":
//               navigate(`/clerk/${userData._id}`); // Redirect clerk to clerk page
//               break;
//             case "asset approver":
//               navigate(`/approver/${userData._id}`); // Redirect asset approver to asset approver page
//               break;
//             default:
//               alert("You are not registered");
//           }
//         } else {
//           // Handle error from the backend
//           if (response.message === "Incorrect password") {
//             setPasswordError("Incorrect password");
//           } else if (response.message === "No record found with this name") {
//             setNameError("No record found with this name");
//           } else {
//             alert("Error occurred during login");
//           }
//         }
//       })
//       .catch((err) => {
//         if (err.response) {
//           // Server responded with a status other than 2xx
//           if (err.response.status === 401) {
//             setPasswordError("Incorrect password");
//           } else if (err.response.status === 404) {
//             setNameError("No record found with this Name");
//           } else {
//             alert("An unexpected error occurred");
//           }
//         } else {
//           // Error occurred in setting up the request
//           console.error(err);
//           alert("An unexpected error occurred");
//         }
//       });
//   };

//   const handleForgotPassword = () => {
   
//     navigate("/reset-password"); // Navigate to the password reset page or modal
//   };

//   return (
//     <div className="bg-white min-h-screen flex flex-col items-center">
//       {/* Image Container */}
//       <div className="w-full bg-gray-300">
//         <img 
//           src="/login.jpeg" // Replace with the path to your image
//           alt="Background" 
//           className="w-full h-54 object-cover" // Adjust height as needed
//         />
//       </div>
//       {/* Login Form Container */}
//       <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg -mt-8 relative">
//         <h1 className="text-2xl font-semibold text-center text-gray-500 mt-8 mb-6">
//           Login to Your Account
//         </h1>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-6">
//             <label htmlFor="name" className="block mb-2 text-sm text-gray-600">
//               Name
//             </label>
//             <input
//               type="name"
//               id="name"
//               name="name"
//               placeholder="Enter UserName"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//               required
//             />
//             {nameError && <p className="text-red-500">{nameError}</p>}
//           </div>
//           <div className="mb-6 relative">
//             <label htmlFor="password" className="block mb-2 text-sm text-gray-600">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"} // Toggle input type
//                 id="password"
//                 name="password"
//                 placeholder="Enter Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 pr-12"
//                 required
//               />
//               {/* Eye Icon */}
//               <div
//                 onClick={() => setShowPassword(!showPassword)}
//                 onMouseEnter={() => setTooltip(showPassword ? "Hide Password" : "Show Password")}
//                 onMouseLeave={() => setTooltip("")}
//                 className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
//                 style={{ height: '100%' }} // Ensure the icon container takes full height
//               >
//                 {showPassword ? (
//                   <FaEyeSlash className="w-5 h-5 text-gray-500" />
//                 ) : (
//                   <FaEye className="w-5 h-5 text-gray-500" />
//                 )}
//               </div>
//               {tooltip && (
//                 <div className="absolute top-full right-0 mt-1 bg-gray-700 text-white text-xs rounded py-1 px-2">
//                   {tooltip}
//                 </div>
//               )}
//             </div>
//             {passwordError && <p className="text-red-500">{passwordError}</p>}
//           </div>
//           <button
//             type="submit"
//             className="w-32 bg-green-500 text-white py-2 rounded-lg mx-auto block hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-4 mb-6"
//           >
//             Login
//           </button>
//         </form>
//         <div className="text-center">
//           <p className="text-sm text-cyan-600 cursor-pointer" onClick={handleForgotPassword}>
//             Forgot Password?
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login({ setCuser }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [tooltip, setTooltip] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    setNameError("");
    setPasswordError("");
  
    let hasError = false;
  
    if (!name) {
      setNameError("Name is required");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    }
  
    if (hasError) return;
  
    axios.post("http://localhost:3001", { name, password })
      .then(result => {
        const response = result.data;
  
        // Check for success
        if (response.message === "Login successful") {
          const userData = response.user; // Extract user data from the response
          const token = response.token; // Extract the token
  
          // Store user data and token in localStorage
          localStorage.setItem('currentUser', JSON.stringify(userData));
          localStorage.setItem('token', token); // Store the token separately
          setCuser(userData);
  
          // Redirect based on the user's role
          switch (userData.role) {
            case "Admin":
              navigate("/admin/admin-dashboard");
              break;
            case "user":
              navigate("/user/customer-dashboard");
              break;
            case "manager":
              navigate("/manager/manager-dasboard");
              break;
            default:
              alert("You are not registered");
          }
        } else {
          // Handle specific error messages
          if (response.message === "Incorrect password") {
            setPasswordError("Incorrect password");
          } else if (response.message === "No record found with this name") {
            setNameError("No record found with this name");
          } else {
            alert("Error occurred during login");
          }
        }
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 401) {
            setPasswordError("Incorrect password");
          } else if (err.response.status === 404) {
            setNameError("No record found with this Name");
          } else {
            alert("An unexpected error occurred");
          }
        } else {
          console.error(err);
          alert("An unexpected error occurred");
        }
      });
  };

  const handleForgotPassword = () => {
    navigate("/reset");
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center dark:bg-gray-900">
      <div className="max-w-md w-full p-6 bg-gray-800 rounded-lg shadow-lg relative dark:bg-gray-800">
        <h1 className="text-2xl font-semibold text-center text-white mt-8 mb-6 dark:text-white">
          Login to Your Account
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-6">
            <label htmlFor="name" className="block mb-2 text-sm text-gray-300 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter UserName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              required
            />
            {nameError && <p className="text-red-500">{nameError}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-6 relative">
            <label htmlFor="password" className="block mb-2 text-sm text-gray-300 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12 dark:bg-gray-700 dark:text-white"
                required
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                onMouseEnter={() => setTooltip(showPassword ? "Hide Password" : "Show Password")}
                onMouseLeave={() => setTooltip("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                style={{ height: '100%' }}
              >
                {showPassword ? (
                  <FaEyeSlash className="w-5 h-5 text-gray-400 dark:text-gray-400" />
                ) : (
                  <FaEye className="w-5 h-5 text-gray-400 dark:text-gray-400" />
                )}
              </div>
              {tooltip && (
                <div className="absolute top-full right-0 mt-1 bg-gray-700 text-white text-xs rounded py-1 px-2 dark:bg-gray-700 dark:text-white">
                  {tooltip}
                </div>
              )}
            </div>
            {passwordError && <p className="text-red-500">{passwordError}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-32 bg-blue-500 text-white py-2 rounded-lg mx-auto block hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-4 mb-6 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Login
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center mb-4">
          <p
            className="text-sm text-cyan-400 cursor-pointer dark:text-cyan-400"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </p>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-400 dark:text-gray-400">
            Don't have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer hover:underline dark:text-blue-400"
              onClick={() => navigate("/signup")} // Navigate to the signup page
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;