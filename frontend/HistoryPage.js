import React, { useEffect, useState } from "react";
import axios from "axios";  // Make sure to install axios
import "./History.css"
const HistoryPage = () => {
  const [pdfs, setPdfs] = useState([]);
  const userEmail = localStorage.getItem("email");  // Assuming email is stored in localStorage

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/history/${userEmail}`);
        setPdfs(res.data);  // Save PDFs returned by the server
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchHistory();
  }, [userEmail]);

  return (
    <div className="history-container">
      <h2 className="history-heading">All Segmented Reports History</h2>

      {pdfs.length === 0 ? (
        <p>No PDFs found.</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>#</th>
              <th>PDF Link</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {pdfs.map((pdf, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>
                  <a
                    href={`http://localhost:5000/uploads/pdfs/${pdf.pdfFile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {pdf.pdfFile}
                  </a>
                </td>
                <td>{new Date(pdf.downloadedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HistoryPage;
