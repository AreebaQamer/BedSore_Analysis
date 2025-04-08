// import React from "react";
// import "./Login.css";
// import image from "./image.png"; // Path to your image file
// import { Link } from "react-router-dom";
// import { FaGoogle, FaFacebook } from "react-icons/fa"; // Import icons
// const Login = () => {
//     return (
//         <div className="login-container">
//             <div className="login-left">
//                 <h2 className="login-title">Login</h2>
//                 <div className="social-login">
//                     <button className="google-btn">
//                         <FaGoogle className="icon google-icon" /> Login with Google
//                     </button>
//                     <button className="facebook-btn">
//                         <FaFacebook className="icon facebook-icon" /> Login with Facebook
//                     </button>
//                 </div>
//                 <p className="or-text">- OR -</p>
//                 <input type="name" placeholder="Name" className="input-field" />
//                 <input type="email" placeholder="Email Address" className="input-field" />
//                 <input type="password" placeholder="Password" className="input-field" />
//                 <button className="login-btn">Login Account</button>
//                 <p className="signup-text">
//                     Don’t have an account? <Link to="/signup">Signup</Link>
//                 </p>

//             </div>
//             <div className="login-right">
//                 <p className="login-text">“Explore segmented results in 3D, visual insights here.”</p>
//                 <img src={image} alt="3D Illustration" className="visual-image" />
//             </div>
//         </div>
//     );
// };

// export default Login;

// src/Login.js
// import React, { useState } from "react";
// import "./Login.css";
// import image from "./image.png"; // Path to your image file
// import { Link } from "react-router-dom";
// import { FaGoogle, FaFacebook } from "react-icons/fa"; // Import icons
// import { loginUser } from './api'; // Import the login API function

// const Login = () => {
//   const [form, setForm] = useState({ email: '', password: '' });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await loginUser(form);
//       alert('Login successful!');
//       console.log(res.data); // You can store JWT token or navigate
//     } catch (err) {
//       alert(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-left">
//         <h2 className="login-title">Login</h2>
//         <div className="social-login">
//           <button className="google-btn">
//             <FaGoogle className="icon google-icon" /> Login with Google
//           </button>
//           <button className="facebook-btn">
//             <FaFacebook className="icon facebook-icon" /> Login with Facebook
//           </button>
//         </div>
//         <p className="or-text">- OR -</p>
//         <form onSubmit={handleSubmit}>
//           <input 
//             type="email" 
//             name="email" 
//             onChange={handleChange} 
//             placeholder="Email Address" 
//             className="input-field" 
//             required 
//           />
//           <input 
//             type="password" 
//             name="password" 
//             onChange={handleChange} 
//             placeholder="Password" 
//             className="input-field" 
//             required 
//           />
//           <button className="login-btn">Login Account</button>
//         </form>
//         <p className="signup-text">
//           Don’t have an account? <Link to="/signup">Signup</Link>
//         </p>
//       </div>
//       <div className="login-right">
//         <p className="login-text">“Explore segmented results in 3D, visual insights here.”</p>
//         <img src={image} alt="3D Illustration" className="visual-image" />
//       </div>
//     </div>
//   );
// };

// export default Login;


// // src/Login.js
// import React, { useState } from "react";
// import "./Login.css";
// import image from "./image.png";
// import { Link, useNavigate } from "react-router-dom";
// import { FaGoogle, FaFacebook } from "react-icons/fa";
// import { loginUser } from './api';

// const Login = () => {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const navigate = useNavigate(); // For redirecting after login

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await loginUser(form);
//       localStorage.setItem("token", res.data.token);         // Store token
//       localStorage.setItem("username", res.data.user.name);  // Store name (optional)

//       alert('Login successful!');
//       navigate("/dashboard"); // Redirect user to dashboard or home page
//     } catch (err) {
//       alert(err.response?.data?.msg || "Login failed");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-left">
//         <h2 className="login-title">Login</h2>

//         <div className="social-login">
//           <button className="google-btn">
//             <FaGoogle className="icon google-icon" /> Login with Google
//           </button>
//           <button className="facebook-btn">
//             <FaFacebook className="icon facebook-icon" /> Login with Facebook
//           </button>
//         </div>

//         <p className="or-text">- OR -</p>

//         <form onSubmit={handleSubmit}>
//           <input 
//             type="email" 
//             name="email" 
//             onChange={handleChange} 
//             placeholder="Email Address" 
//             className="input-field" 
//             required 
//           />
//           <input 
//             type="password" 
//             name="password" 
//             onChange={handleChange} 
//             placeholder="Password" 
//             className="input-field" 
//             required 
//           />
//           <button className="login-btn">Login Account</button>
//         </form>

//         <p className="signup-text">
//           Don’t have an account? <Link to="/signup">Signup</Link>
//         </p>
//       </div>

//       <div className="login-right">
//         <p className="login-text">“Explore segmented results in 3D, visual insights here.”</p>
//         <img src={image} alt="3D Illustration" className="visual-image" />
//       </div>
//     </div>
//   );
// };

// export default Login;


// src/Login.js
import React, { useState } from "react";
import "./Login1.css";
import image from "./image.png";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { loginUser } from './api';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const navigate = useNavigate(); // For redirecting after login

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser(form);
            localStorage.setItem("token", res.data.token);         // Store token
            localStorage.setItem("username", res.data.user.name);  // Store name (optional)
            localStorage.setItem("userId", res.data.user.id);
            localStorage.setItem("email", res.data.user.email);
            alert('Login successful!'+ res.data.user.email);
            console.log(res.data);  // Log the response to verify the structure
            navigate("/dashboard"); // Redirect user to dashboard or home page
        } catch (err) {
            alert(err.response?.data?.msg || "Login failed");
        }
    };

    return (
        <div className="login-container1">
            <div className="login-left1">
                <h2 className="login-title1">Login</h2>

                <div className="social-login1">
                    <button className="google-btn1">
                        <FaGoogle className="icon google-icon1" /> Login with Google
                    </button>
                    <button className="facebook-btn1">
                        <FaFacebook className="icon facebook-icon1" /> Login with Facebook
                    </button>
                </div>

                <p className="or-text1">- OR -</p>

                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            placeholder="Email Address"
                            className="input-field1"
                            required
                        />
                    </div>
                    <div >
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            placeholder="Password"
                            className="input-field1"
                            required
                        />
                    </div>
                    <button className="login-btn1">Login Account</button>
                </form>

                <p className="signup-text1">
                    Don’t have an account? <Link to="/signup">Signup</Link>
                </p>
            </div>

            <div className="login-right1">
                <p className="login-text1">“Explore segmented results in 3D, visual insights here.”</p>
                <img src={image} alt="3D Illustration" className="visual-image1" />
            </div>
        </div>
    );
};

export default Login;
