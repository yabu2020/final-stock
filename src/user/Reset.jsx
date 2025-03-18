import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons

function ResetPassword() {
  const { userId } = useParams();
  const [name, setName] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false); // State for new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Updated regular expression for password validation
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

  const predefinedQuestions = [
    'Date of Birth',
    'Favorite Food',
    'Mother’s Maiden Name',
    'First Pet’s Name',
    'High School Name',
    'City of Birth'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Check if all fields are filled
    if (!name || !securityQuestion || !securityAnswer || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Validate new password
    if (!passwordRegex.test(newPassword)) {
      setError('Password must be at least 6 characters long and include both letters and numbers.');
      return;
    }

    // Proceed with password reset request
    axios
      .post('http://localhost:3001/reset-password', { name, securityQuestion, securityAnswer, newPassword })
      .then((response) => {
        if (response.data.success) {
          setMessage('Password has been reset successfully. You will be redirected to the login page.');
          setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
        } else {
          setError(response.data.message || 'Error resetting password. Please try again.');
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
        setError(errorMessage);
      });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 shadow-lg rounded-lg border border-gray-200">
      <h1 className="text-2xl font-bold text-blue-500 mb-6">Reset Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-md font-semibold text-gray-500">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 sm:text-sm"
          />
        </div>
        {name && (
          <>
            <div>
              <label htmlFor="securityQuestion" className="block text-md font-semibold mt-4 text-gray-500">Security Question</label>
              <select
                id="securityQuestion"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-gray-500 sm:text-sm"
              >
                <option value="" disabled>Select a security question</option>
                {predefinedQuestions.map((question, index) => (
                  <option key={index} value={question}>{question}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="securityAnswer" className="block text-md font-semibold mt-4 text-gray-500">Answer Security Question</label>
              <input
                type="text"
                id="securityAnswer"
                placeholder="Enter your answer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-gray-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-md font-semibold mt-4 text-gray-500">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-gray-500 sm:text-sm"
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  title={showNewPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-md mt-4 font-semibold text-gray-500">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border  bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>
          </>
        )}
        <button
          type="submit"
          className="w-1/2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md mt-4 mb-6 ml-20 shadow-sm hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
        >
          Reset Password
        </button>
        {message && <p className="text-blue-500 font-semibold text-center">{message}</p>}
        {error && <p className="text-red-600 font-semibold text-center">{error}</p>}
      </form>
    </div>
  );
}

export default ResetPassword;
