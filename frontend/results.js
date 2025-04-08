import React, { useRef } from 'react';
import './results.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SegmentationResultsPage = () => {
  
  const navigate = useNavigate();
  const location = useLocation();
  const { originalImage, segmentedImage } = location.state || {};

  const originalRef = useRef(null);
  const segmentedRef = useRef(null);

  const downloadReport = async () => {
    const email = localStorage.getItem('email'); // ya jahan se email mil rahi ho
    if (!email) {
      alert('User email not found');
      return;
    }
  
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    let currentHeight = 20;
  
    pdf.setFontSize(18);
    pdf.text('Bedsore Segmentation Results Report', 15, currentHeight);
    currentHeight += 10;
  
    const captureImage = async (ref) => {
      const canvas = await html2canvas(ref.current, { useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfImgWidth = pageWidth - 20;
      const pdfImgHeight = (imgProps.height * pdfImgWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 10, currentHeight, pdfImgWidth, pdfImgHeight);
      return pdfImgHeight;
    };
  
    if (originalRef.current) {
      currentHeight += 10;
      currentHeight += await captureImage(originalRef);
    }
  
    if (segmentedRef.current) {
      currentHeight += 10;
      if (currentHeight + 60 > 295) {
        pdf.addPage();
        currentHeight = 20;
      }
      currentHeight += await captureImage(segmentedRef);
    }
  
    // Generate PDF Blob
    const pdfBlob = pdf.output('blob');
  
    const formData = new FormData();
    formData.append('pdf', pdfBlob, 'segmentation_report.pdf');
    formData.append('email', email);
  
    try {
      const response = await fetch('http://localhost:5000/api/history/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        alert('PDF uploaded and saved to history!');
      } else {
        alert('Failed to upload PDF');
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  
    // Also allow user to download it locally
    pdf.save('segmentation_report.pdf');
  };

  return (
    <div className="segmentation-container">
      <div className="back-button">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft className="arrow-icon" /> Back
        </button>
      </div>

      <h1 className="title">Segmentation Results</h1>

      <div className="image-wrapper">
        {originalImage && (
          <div className="image-box" ref={originalRef}>
            <div className="image-label">Original Image</div>
            <img src={originalImage} alt="Original" className="image-display" crossOrigin="anonymous" />
          </div>
        )}

        {segmentedImage && (
          <div className="image-box" ref={segmentedRef}>
            <div className="image-label">Segmented Image</div>
            <img src={segmentedImage} alt="Segmented" className="image-display" crossOrigin="anonymous" />
          </div>
        )}
      </div>

      <button className="report-btn" onClick={downloadReport}>
        Download Report
      </button>
    </div>
  );
};

export default SegmentationResultsPage;
