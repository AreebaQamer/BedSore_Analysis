import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { FaImage, FaSignOutAlt, FaChartPie, FaCloudUploadAlt, FaFileAlt, FaCog } from "react-icons/fa";
import ConfirmationModal from './ConfirmationModal';  // Import the modal
import logo from './logoFY.avif'; // adjust path if needed
import { NavLink } from 'react-router-dom';
import { useEffect } from "react"; // Already partially imported

const Dashboard = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const name = localStorage.getItem("username") || "User";
  const email = localStorage.getItem("email");
  const [totalAnalysis, setTotalAnalysis] = useState(0);
  const [recentUploads, setRecentUploads] = useState(0);
  const [completedReports, setCompletedReports] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:5000/api/dashboard/stats/${email}`)
      .then((res) => res.json())
      .then((data) => {
        setTotalAnalysis(data.totalAnalysis);
        setRecentUploads(data.recentUploads);
        setCompletedReports(data.completedReports);
      })
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);
  // Placeholder avatar (like WhatsApp default image)
  const defaultAvatar = "https://ui-avatars.com/api/?name=" + encodeURIComponent(name) + "&background=random&color=fff";
  // Check if the user is logged in (if token exists)
  if (!localStorage.getItem("token")) {
    navigate("/");  // Redirect to login if no token
    return null;  // Prevent rendering the dashboard until redirected
  }

  const handleLogoutClick = () => {
    setShowModal(true);  // Show the confirmation modal
  };

  const handleConfirmLogout = () => {
    // Remove token and username from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    // Redirect to the login page
    navigate("/");  // Adjust this to your login page URL
  };

  const handleCancelLogout = () => {
    setShowModal(false);  // Close the modal without logging out
  };
  
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="SegAnalytics Logo" className="logo-img" />
          <h2 className="logo-text">SegAnalytics</h2>
        </div>

        <ul className="nav-links">
          <li><FaChartPie /> Overview</li>
          <li onClick={() => navigate("/upload")}><FaCloudUploadAlt /> Upload Image</li>
          <li onClick={() => navigate("/himages")}><FaImage />All Images</li>
          <li onClick={() => navigate("/history")}><FaFileAlt />All Reports</li>  {/* Add this line */}
        </ul>
        <div className="bottom-links">
          <li><FaCog /> Settings</li>
          <li onClick={handleLogoutClick}>
            <FaSignOutAlt /> Logout
          </li>
        </div>
      </aside>

      <div className="main-content">
        <header>
          {/* <input type="text" placeholder="search anything here" / */}
          <div className="profile">
            <img src={defaultAvatar} alt="User" />
            <span>{name}</span>
          </div>
        </header>

        <nav className="top-nav">
          <NavLink to="/dashboard" className="nav-link" activeClassName="active">
            Dashboard
          </NavLink>
          <NavLink to="/upload" className="nav-link" activeClassName="active">
            Analysis
          </NavLink>
          <NavLink to="/about" className="nav-link" activeClassName="active">
            About us
          </NavLink>
          <NavLink to="/contact" className="nav-link" activeClassName="active">
            Contact us
          </NavLink>
        </nav>
        <section className="stats-cards">
          <div className="card">
            <h3>Total Analysis</h3>
            <p className="green">{totalAnalysis}</p>
          </div>
          <div className="card">
            <h3>Recent Uploads</h3>
            <p className="green">{recentUploads}</p>
          </div>
          <div className="card">
            <h3>Completed Reports</h3>
            <p className="green">{completedReports}</p>
          </div>
        </section>
        <section className="recent-activity">
          <h3>Recent Activity</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Analysis Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Oct 23, 2024</td>
                <td>Image Segmentation</td>
                <td>Completed</td>
              </tr>
              <tr>
                <td>Oct 23, 2024</td>
                <td>Image Processing</td>
                <td>Completed</td>
              </tr>
              <tr>
                <td>Oct 23, 2024</td>
                <td>Report Generation</td>
                <td>Completed</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      {/* Confirmation Modal for Logout */}
      <ConfirmationModal
        show={showModal}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </div>
  );
};

export default Dashboard;
