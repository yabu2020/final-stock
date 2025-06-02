import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function SecurityQuestionPage() {
  const { userId } = useParams();
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newSecurityQuestion, setNewSecurityQuestion] = useState("");
  const [newSecurityAnswer, setNewSecurityAnswer] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [updateError, setUpdateError] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const effectiveUserId = userId || currentUser?._id;

  const predefinedQuestions = [
    "Date of Birth",
    "Favorite Food",
    "Mother’s Maiden Name",
    "First Pet’s Name",
    "High School Name",
    "City of Birth",
  ];

  useEffect(() => {
    if (!effectiveUserId) {
      setUpdateError("User identification failed. Please log in again.");
      return;
    }
    fetchSecurityQuestion(effectiveUserId);
  }, [effectiveUserId]);

  const fetchSecurityQuestion = (effectiveUserId) => {
    axios
      .get("http://localhost:3001/security-question", { 
        params: { userId: effectiveUserId } 
      })
      .then((response) => {
        const { securityQuestion, securityAnswer } = response.data;
        setSecurityQuestion(securityQuestion || "No current security question");
        setSecurityAnswer(securityAnswer || "");
      })
      .catch((error) => {
        setUpdateError("Failed to load security question. Please try again.");
      });
  };

  const handleUpdateSecurityQuestion = (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const effectiveUserId = userId || currentUser?._id;

    if (!effectiveUserId) {
      setUpdateError("User identification failed. Please log in again.");
      return;
    }

    axios
      .post("http://localhost:3001/update-security-question", {
        userId,
        newSecurityQuestion,
        newSecurityAnswer,
      })
      .then((response) => {
        if (response.data.success) {
          setUpdateMessage("Security question updated successfully.");
          setSecurityQuestion(newSecurityQuestion);
          setSecurityAnswer(newSecurityAnswer);
          setNewSecurityQuestion("");
          setNewSecurityAnswer("");
        } else {
          setUpdateError("Failed to update security question.");
        }
      })
      .catch((error) => {
        setUpdateError(`Error: ${error.message}`);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-blue-400 mb-6 text-center">
          Security Question
        </h2>
        <p className="text-gray-300 mb-6 text-center">
          <strong>Your Current Security Question is:</strong> {securityQuestion}
        </p>

        <form onSubmit={handleUpdateSecurityQuestion} className="space-y-4">
          {/* New Security Question */}
          <div>
            <label htmlFor="newSecurityQuestion" className="block text-md font-medium text-gray-300 mb-2">
              Set Your New Security Question
            </label>
            <select
              id="newSecurityQuestion"
              value={newSecurityQuestion}
              onChange={(e) => setNewSecurityQuestion(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select a question</option>
              {predefinedQuestions.map((question, index) => (
                <option key={index} value={question}>
                  {question}
                </option>
              ))}
            </select>
          </div>

          {/* New Security Answer */}
          <div>
            <label htmlFor="newSecurityAnswer" className="block text-md font-medium text-gray-300 mb-2">
              Your New Security Answer
            </label>
            <input
              type="text"
              id="newSecurityAnswer"
              placeholder="Enter your new security answer"
              value={newSecurityAnswer}
              onChange={(e) => setNewSecurityAnswer(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            Update Security Question
          </button>

          {/* Success/Error Messages */}
          {updateMessage && (
            <p className="text-green-500 text-md mt-4 text-center">
              {updateMessage}
            </p>
          )}
          {updateError && (
            <p className="text-red-500 text-md mt-4 text-center">
              {updateError}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default SecurityQuestionPage;