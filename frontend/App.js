// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Sign";
import Dashboard from "./Dashbord";
import UploadImage from "./UploadImage";
import SegmentationResultsPage from "./results";
import HistoryPage from "./HistoryPage";
import HistoryImages from "./HistoryImages";
import About from "./About";
import ContactForm from "./Contact";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} /> {/* Add this route */}
      <Route path="/upload" element={<UploadImage />} />
      <Route path="/results" element={<SegmentationResultsPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/himages" element={<HistoryImages />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<ContactForm />} />
    </Routes>
  );
}

export default App;
