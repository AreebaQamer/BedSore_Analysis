import React from 'react';
import './about.css';
import towerImage from './tower.jpg';
import bedsoreImage from './bedsore.jpg';

function About() {
  return (
    <>
      {/* Vision Section */}
      <div className="about-container">
        <h2>Our Vision</h2>
        <p>
          The <strong className="peri">Segmentation Strategies for Enhancing System Automation</strong> project aims to improve automation by
          using segmentation techniques in telecommunications, healthcare, and agriculture.
          This system will employ segmentation algorithms to optimize processes like network resource allocation,
          bed sore monitoring, and plant irrigation, improving operational efficiency, accuracy, and real-time
          adaptability across industries.
        </p>
      </div>

      {/* Section 1: Image Right, Content Left */}
      <div className="section">
        <div className="content-side">
          <h2>Power Transmission Tower Analysis</h2>
          <p>
            By applying image processing techniques to power transmission towers, we can
            automate structural analysis and optimize power distribution. This advanced
            approach enables precise measurements, enhances maintenance strategies, and
            improves overall efficiency in power networks.
          </p>
        </div>
        <div className="image-side">
          <img src={towerImage} alt="Power Tower" />
        </div>
      </div>

      {/* Section 2: Reverse Layout (Image Left, Content Right) */}
<div className="section reverse">
  <div className="image-side">
    <img src={bedsoreImage} alt="Bedsore Analysis" />
  </div>
  <div className="content-side">
    <h2>Bedsore Analysis</h2>
    <p>
      Accurate, real-time monitoring of bedsores is crucial to prevent worsening
      conditions. Segmentation data helps identify wound stages (healed, stage 1–4),
      track progression, and measure area and depth for better healing assessment.
    </p>
  </div>
</div>
    </>
  );
}

export default About;
