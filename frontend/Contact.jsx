import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "./contact.css";

const ContactForm = () => {
  return (
    <div className="parent">
    <div className="container">
      <div className="contact-section">
        <h2>Contact us</h2>
        <p>
          Let's talk about your website or project. Send us a message and we
          will be in touch within one business day.
        </p>
      </div>

      <div className="form-container">
        <form>
          <h3>Send us a message</h3>
          <label>Name</label>
          <input type="text" placeholder="Full name" />

          <label>Email</label>
          <input type="email" placeholder="name@gmail.com" />

          <label>Message</label>
          <textarea placeholder="Your message here"></textarea>

          <button type="submit">Submit</button>
        </form>

        <div className="contact-info">
          <h3>Contact Info</h3>
          <div className="info-item">
            <FaEnvelope className="info-icon" />
            <div className="info-text">
              <strong>Email</strong>
              <hr />
              <span>khadijahbintetariq@gmail.com</span>
            </div>
          </div>

          <div className="info-item">
            <FaMapMarkerAlt className="info-icon" />
            <div className="info-text">
              <strong>Location</strong>
              <hr />
              <span>PUCIT,Old Campus</span>
            </div>
          </div>

          <div className="info-item">
            <FaPhoneAlt className="info-icon" />
            <div className="info-text">
              <strong>Phone</strong>
              <hr />
              <span>0324-1443890</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ContactForm;
