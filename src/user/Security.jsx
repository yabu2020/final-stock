import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function SecurityQuestionPage() {
  const { userId } = useParams();
  console.log("User ID from useParams:", userId); // Log the userId
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newSecurityQuestion, setNewSecurityQuestion] = useState("");
  const [newSecurityAnswer, setNewSecurityAnswer] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [updateError, setUpdateError] = useState("");

  const predefinedQuestions = [
    "Date of Birth",
    "Favorite Food",
    "Mother’s Maiden Name",
    "First Pet’s Name",
    "High School Name",
    "City of Birth",
  ];

  useEffect(() => {
    if (userId) {
      console.log("Fetching security question for userId:", userId); // Log the userId
      fetchSecurityQuestion(userId);
    } else {
      console.error("User ID is undefined");
    }
  }, [userId]);

  const fetchSecurityQuestion = (userId) => {
    console.log("Fetching security question for userId:", userId); // Log the userId being sent

    axios
      .get("http://localhost:3001/security-question", { params: { userId } })
      .then((response) => {
        console.log("Response from /security-question:", response.data); // Log the response
        const { securityQuestion, securityAnswer } = response.data;
        setSecurityQuestion(securityQuestion || "No current security question");
        setSecurityAnswer(securityAnswer || "");
      })
      .catch((error) => {
        console.error(
          "Error fetching security question:",
          error.response?.data || error.message
        ); // Log errors
        setUpdateError(`Error: ${error.message}`);
      });
  };

  const handleUpdateSecurityQuestion = (e) => {
    e.preventDefault();
    setUpdateMessage("");
    setUpdateError("");

    if (!newSecurityQuestion || !newSecurityAnswer) {
      setUpdateError("Both question and answer are required.");
      return;
    }

    console.log("Updating security question for userId:", userId); // Log the userId
    console.log("New security question:", newSecurityQuestion); // Log the new question
    console.log("New security answer:", newSecurityAnswer); // Log the new answer

    axios
      .post("http://localhost:3001/update-security-question", {
        userId,
        newSecurityQuestion,
        newSecurityAnswer,
      })
      .then((response) => {
        console.log("Response from /update-security-question:", response.data); // Log the response
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
        console.error(
          "Error updating security question:",
          error.response?.data || error.message
        ); // Log errors
        setUpdateError(`Error: ${error.message}`);
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-blue-400 mb-6">Security Question</h2>
      <p className="text-lg text-gray-300 mb-6">
        <strong>Your Current Security Question is:</strong> {securityQuestion}
      </p>

      <form onSubmit={handleUpdateSecurityQuestion} className="space-y-6">
        {/* New Security Question */}
        <div>
          <label htmlFor="newSecurityQuestion" className="block text-lg font-medium text-gray-300 mb-2">
            <strong>Set Your New Security Question</strong>
          </label>
          <select
            id="newSecurityQuestion"
            value={newSecurityQuestion}
            onChange={(e) => setNewSecurityQuestion(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label htmlFor="newSecurityAnswer" className="block text-lg font-medium text-gray-300 mb-2">
            <strong>Your New Security Answer</strong>
          </label>
          <input
            type="text"
            id="newSecurityAnswer"
            placeholder="Enter your new security answer"
            value={newSecurityAnswer}
            onChange={(e) => setNewSecurityAnswer(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Update Security Question
        </button>

        {/* Success/Error Messages */}
        {updateMessage && <p className="text-green-500 text-lg mt-4">{updateMessage}</p>}
        {updateError && <p className="text-red-500 text-lg mt-4">{updateError}</p>}
      </form>
    </div>
  );
}

export default SecurityQuestionPage;