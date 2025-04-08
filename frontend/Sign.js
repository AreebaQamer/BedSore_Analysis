// import React from "react";
// import "./Sign.css";
// import image from "./image.png"; // Path to your image
// import { FaGoogle, FaFacebook } from "react-icons/fa";
// import { Link } from "react-router-dom";
// const Signup = () => {
//     return (
//         <div className="signup-container">
//             {/* Left Side - Text & Image */}
//             <div className="signup-left">
//                 <p className="signup-text">“Explore segmented results in 3D, visual insights here.”</p>
//                 <img src={image} alt="3D Illustration" className="visual-image" />
//             </div>

//             {/* Right Side - Signup Form */}
//             <div className="signup-right">
//                 <h2 className="signup-title">Create Account</h2>

//                 {/* Social Login Buttons */}
//                 <div className="social-login">
//                     <button className="google-btn">
//                         <FaGoogle className="icon google-icon" /> Sign up with Google
//                     </button>
//                     <button className="facebook-btn">
//                         <FaFacebook className="icon facebook-icon" /> Sign up with Facebook
//                     </button>
//                 </div>

//                 <p className="or-text">- OR -</p>

//                 {/* Signup Form Fields */}
//                 <input type="text" placeholder="Full name" className="input-field" />
//                 <input type="email" placeholder="Email Address" className="input-field" />
//                 <input type="password" placeholder="Password" className="input-field" />

//                 <button className="signup-btn">Create Account</button>

//                 <p className="login-text">
//                     Already have an account? <Link to="/">Login</Link>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default Signup;

// src/Signup.js
// import React, { useState } from "react";
// import "./Sign.css";
// import image from "./image.png"; // Path to your image
// import { FaGoogle, FaFacebook } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import { registerUser } from './api'; // Import the register API function

// const Signup = () => {
//   const [form, setForm] = useState({ name: '', email: '', password: '' });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await registerUser(form);
//       alert("Signup successful! Welcome, " + res.data.user.name);
//     } catch (err) {
//       alert(err.response?.data?.message || "Signup failed");
//     }
//   };

//   return (
//     <div className="signup-container">
//       <div className="signup-left">
//         <p className="signup-text">“Explore segmented results in 3D, visual insights here.”</p>
//         <img src={image} alt="3D Illustration" className="visual-image" />
//       </div>

//       <div className="signup-right">
//         <h2 className="signup-title">Create Account</h2>

//         <div className="social-login">
//           <button className="google-btn">
//             <FaGoogle className="icon google-icon" /> Sign up with Google
//           </button>
//           <button className="facebook-btn">
//             <FaFacebook className="icon facebook-icon" /> Sign up with Facebook
//           </button>
//         </div>

//         <p className="or-text">- OR -</p>

//         <form onSubmit={handleSubmit}>
//           <input 
//             type="text" 
//             name="name" 
//             onChange={handleChange} 
//             placeholder="Full name" 
//             className="input-field" 
//             required 
//           />
//           <br/>
//           <input 
//             type="email" 
//             name="email" 
//             onChange={handleChange} 
//             placeholder="Email Address" 
//             className="input-field" 
//             required 
//           />
//            <br/>
//           <input 
//             type="password" 
//             name="password" 
//             onChange={handleChange} 
//             placeholder="Password" 
//             className="input-field" 
//             required 
//           />
          
//           <button className="signup-btn">Create Account</button>
//         </form>

//         <p className="login-text">
//           Already have an account? <Link to="/">Login</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;


// src/Signup.js
import React, { useState } from "react";
import "./Sign.css";
import image from "./image.png"; // Path to your image
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { registerUser } from './api'; // Import the register API function

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate(); // For redirecting after signup

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(form);
      alert("Signup successful! Welcome, " + res.data.user.name);
      localStorage.setItem("token", res.data.token); // Store token (if needed)
      localStorage.setItem("username", res.data.user.name); // Optionally store user name

      navigate("/dashboard"); // Redirect to the dashboard after successful signup
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <p className="signup-text">“Explore segmented results in 3D, visual insights here.”</p>
        <img src={image} alt="3D Illustration" className="visual-image" />
      </div>

      <div className="signup-right">
        <h2 className="signup-title">Create Account</h2>

        <div className="social-login">
          <button className="google-btn">
            <FaGoogle className="icon google-icon" /> Sign up with Google
          </button>
          <button className="facebook-btn">
            <FaFacebook className="icon facebook-icon" /> Sign up with Facebook
          </button>
        </div>

        <p className="or-text">- OR -</p>

        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="name" 
            onChange={handleChange} 
            placeholder="Full name" 
            className="input-field" 
            required 
          />
          <br />
          <input 
            type="email" 
            name="email" 
            onChange={handleChange} 
            placeholder="Email Address" 
            className="input-field" 
            required 
          />
          <br />
          <input 
            type="password" 
            name="password" 
            onChange={handleChange} 
            placeholder="Password" 
            className="input-field" 
            required 
          />
          <br />
          <button className="signup-btn">Create Account</button>
        </form>

        <p className="login-text">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
