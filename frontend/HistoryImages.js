import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import "./History.css";

const HistoryImages = () => {
  const [uploads, setUploads] = useState([]);
  const [error, setError] = useState(null);
  const userEmail = localStorage.getItem("email");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userEmail) {
      setError("User not logged in.");
      return;
    }

    const fetchUploads = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/upload/user/${userEmail}`);
        setUploads(response.data);
      } catch (error) {
        setError("Error fetching uploads: " + error.response?.data?.message || error.message);
        console.error("Error fetching uploads:", error);
      }
    };

    fetchUploads();
  }, [userEmail]);

  return (
    <div className="history-container">
      <h2 className="history-heading">All Segmented Images History</h2>

      {/* <ul>
        <li onClick={() => navigate("/results")} style={{ cursor: 'pointer' }}>
          <FaImage /> All Images
        </li>
      </ul> */}

      {error && <div className="error-message">{error}</div>}

      <table className="history-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Original Image</th>
            <th>Segmented Image</th>
            <th>Time Created</th>
          </tr>
        </thead>
        <tbody>
          {uploads.length === 0 ? (
            <tr>
              <td colSpan="4">No uploads found.</td>
            </tr>
          ) : (
            uploads.map((upload, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>
                  <a
                    href={`http://localhost:5000/${upload.originalImage.replace(/\\/g, '/')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {upload.originalImage.split('\\').pop()}
                  </a>
                </td>
                <td>
                  <a
                    href={`http://localhost:5000/${upload.segmentedImage.replace(/\\/g, '/')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {upload.segmentedImage.split('\\').pop()}
                  </a>
                </td>

                <td>{new Date(upload.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryImages;
