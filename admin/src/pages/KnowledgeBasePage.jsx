import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const KnowledgeBaseList = () => {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchFileData();
  }, [currentPage]);

  const fetchFileData = async () => {
    const response = await fetch(`http://localhost:5000/files?page=${currentPage}&limit=${itemsPerPage}`);
    const data = await response.json();
    setFiles(data.data); // Assuming data contains a "data" array with file information
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDelete = async (fileId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this file?');

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/files/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFiles(files.filter((file) => file.id !== fileId));
        alert('File deleted successfully!');
      } else {
        alert('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('An error occurred while trying to delete the file');
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Navigation Links */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl sm:text-2xl font-bold">Knowledge Base Files</h1>
        <div className="flex space-x-4">
          {/* <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm sm:text-xs">
            Knowledge Base
          </Link> */}
          <Link to="/add-knowledge-base" className="bg-blue-500 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded text-sm sm:text-xs">
            Add Knowledge Base
          </Link>
        </div>
      </div>

      {/* Files Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Filename</th>
              <th className="py-3 px-6 text-left">Purpose</th>
              <th className="py-3 px-6 text-left">Created On</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-900 text-sm ">
            {files.map((file, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6">{file.filename}</td>
                <td className="py-3 px-6">{file.purpose}</td>
                <td className="py-3 px-6">{new Date(file.created_at * 1000).toLocaleDateString()}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-4 py-2 rounded"
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
        >
          Previous
        </button>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-4 py-2 rounded" onClick={handleNextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default KnowledgeBaseList;
