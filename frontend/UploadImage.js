import React, { useState } from "react";
import "./UploadImage.css";
import "./spinner.css";
import logo from './logoFY.avif';
import { useNavigate } from "react-router-dom";
import {
    FaUpload, FaImage, FaSignOutAlt, FaChartPie,
    FaCloudUploadAlt, FaFileAlt, FaCog
} from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';  // ✅ Import the modal

const name = localStorage.getItem("username") || "User";
const defaultAvatar = "https://ui-avatars.com/api/?name=" + encodeURIComponent(name) + "&background=random&color=fff";

const UploadImage = () => {
    const [image, setImage] = useState(null);
    const [segmentedPath, setSegmentedPath] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false); // ✅ State for logout modal
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        setShowModal(true); // ✅ Show logout modal
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/"); // Redirect to login page
    };

    const handleCancelLogout = () => {
        setShowModal(false);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleAnalysis = async () => {
        if (!image) {
            alert("Please upload an image first.");
            return;
        }

        const userId = localStorage.getItem("email");
        const formData = new FormData();
        formData.append("image", image);
        formData.append("email", userId);

        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setSegmentedPath(data.segmentedImage);

            if (data.success) {
                alert("Analysis complete!");
            } else {
                alert("Analysis failed.");
            }
        } catch (error) {
            console.error("Error uploading:", error);
            alert("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewResults = () => {
        if (!image || !segmentedPath) {
            alert("Please run analysis first.");
            return;
        }

        navigate("/results", {
            state: {
                originalImage: URL.createObjectURL(image),
                segmentedImage: `http://localhost:5000/${segmentedPath.replace(/\\/g, "/")}`
            }
        });
    };

    return (
        <>
            {loading && (
                <div className="spinner-overlay">
                    <div className="spinner"></div>
                    <p style={{ color: "#fff", marginTop: "1rem" }}>Analyzing image, please wait...</p>
                </div>
            )}

            <div className="upload-container">
                <aside className="sidebar">
                    <div className="logo-container">
                        <img src={logo} alt="SegAnalytics Logo" className="logo-img" />
                        <h2 className="logo-text">SegAnalytics</h2>
                    </div>
                    <ul className="nav-links">
                        <li><FaChartPie /> Overview</li>
                        <li onClick={() => navigate("/upload")}><FaCloudUploadAlt />Upload Image</li>
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
                    {/* <header>
                        <div className="profile">
                            <img src={defaultAvatar} alt="User" />
                            <span>{name}</span>
                        </div>
                    </header> */}

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

                    <div className="upload-box">
                        <h2>Upload an Image from Device</h2>
                        <label className="upload-area">
                            <FaUpload className="upload-icon" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                hidden
                            />
                        </label>
                        <br />
                        <button className="run-btn1" onClick={handleAnalysis}>
                            Run Analysis
                        </button>
                        <button className="run-btn1" style={{ marginLeft: '10px' }} onClick={handleViewResults}>
                            View Results
                        </button>
                    </div>
                </div>
            </div>

            {/* ✅ Confirmation Modal Component */}
            <ConfirmationModal
                show={showModal}
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
            />
        </>
    );
};

export default UploadImage;  