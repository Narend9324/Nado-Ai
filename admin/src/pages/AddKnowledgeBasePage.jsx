import React, { useState } from "react";
import { Link } from "react-router-dom";

const AddKnowledgeBasePage = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", file); // Append the selected file to FormData
    formData.append("purpose", "assistants"); // Add 'purpose' as required by OpenAI API

    try {
      // Use the fetch API to upload the file
      const response = await fetch("http://localhost:5000/files", {
        method: "POST",
        body: formData, // Send FormData in the body
      });

      if (response.ok) {
        alert("File uploaded successfully!");
        setFile(null); // Clear the file input after successful upload
      } else {
        const data = await response.json();
        setErrorMessage(data.error || "File upload failed.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while uploading the file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl sm:text-2xl font-bold">
          Upload Knowledge Base
        </h1>
        <div className="flex space-x-4">
          <Link
            to="/"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm sm:text-xs"
          >
            Back
          </Link>
          {/* <Link to="/add-knowledge-base" className="bg-blue-500 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded text-sm sm:text-xs">
            Add Knowledge Base
            </Link> */}
        </div>
      </div>
      {/* <h1 className="text-3xl font-bold text-center mb-6">Upload Knowledge Base</h1> */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg space-y-6"
      >
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Select File to Upload
          </label>
          <input
            type="file"
            onChange={handleFileUpload}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            accept=".docx,.pdf"
            required
          />
        </div>

        {isUploading ? (
          <div className="flex justify-center items-center">
            <svg
              className="animate-spin h-6 w-6 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            <p className="ml-3">Uploading file, please wait...</p>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Upload File
          </button>
        )}

        {errorMessage && (
          <p className="text-red-500 mt-4 text-center">{errorMessage}</p>
        )}
      </form>
    </div>
  );
};

export default AddKnowledgeBasePage;
