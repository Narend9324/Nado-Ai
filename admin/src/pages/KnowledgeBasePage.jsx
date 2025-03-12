import React, { useEffect, useState } from 'react';

const KnowledgeBaseList = () => {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchFileData();
  }, [currentPage]);

  const fetchFileData = async () => {
    // Fetch data from your API for the files
    const response = await fetch(`http://localhost:5000/files?page=${currentPage}&limit=${itemsPerPage}`);
    const data = await response.json();
    setFiles(data.data);  // Assuming data contains a "data" array with file information
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto my-4">
      <h1 className="text-2xl font-bold">Knowledge Base Files</h1>
      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Filename</th>
            <th className="px-4 py-2">Purpose</th>
            <th className="px-4 py-2">Created On</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{file.filename}</td>
              <td className="border px-4 py-2">{file.purpose}</td>
              <td className="border px-4 py-2">{new Date(file.created_at * 1000).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{file.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between">
        <button
          className="bg-gray-500 text-white px-4 py-2"
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
        >
          Previous
        </button>
        <button className="bg-gray-500 text-white px-4 py-2" onClick={handleNextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default KnowledgeBaseList;
