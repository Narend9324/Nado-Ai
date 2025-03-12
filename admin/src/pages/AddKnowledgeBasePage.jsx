import React, { useState } from 'react';

const AddKnowledgeBasePage = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', file); // Append the selected file to FormData
    formData.append('purpose', 'assistants'); // Add 'purpose' as required by OpenAI API

    try {
      // Use the fetch API to upload the file
      const response = await fetch('http://localhost:5000/files', {
        method: 'POST',
        body: formData, // Send FormData in the body
      });

      if (response.ok) {
        alert('File uploaded successfully!');
        setFile(null); // Clear the file input after successful upload
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'File upload failed.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while uploading the file.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto my-4">
      <h1 className="text-2xl font-bold">Upload Knowledge Base</h1>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Select File to Upload</label>
          <input
            type="file"
            onChange={handleFileUpload}
            className="border p-2 w-full"
            accept=".docx,.pdf"
            required
          />
        </div>

        {isUploading ? (
          <p>Uploading file, please wait...</p>
        ) : (
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            Upload File
          </button>
        )}

        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default AddKnowledgeBasePage;
