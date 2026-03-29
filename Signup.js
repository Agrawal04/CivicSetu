// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "../styles/Signup.css";

// function Signup() {
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       await axios.post("http://localhost:5000/api/users/register", form);
//       navigate("/login");
//     } catch (err) {
//       setError(err.response?.data?.message || "Signup failed");
//     }
//   };

// return (
//   <div className="signup-page">
//     <div className="signup-box">
//       <h2>Citizen Signup</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           className="signup-input"
//           name="name"
//           type="text"
//           placeholder="Name"
//           value={form.name}
//           onChange={handleChange}
//           required
//         />
//         <input
//           className="signup-input"
//           name="email"
//           type="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           className="signup-input"
//           name="password"
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//           required
//         />
//         {error && <div className="error">{error}</div>}
//         <button className="signup-button" type="submit">Sign Up</button>
//       </form>
//       <p className="signup-link">
//         Already have an account? <a href="/login">Login</a>
//       </p>
//     </div>
//   </div>
// );
// }

// export default Signup;





import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/signup", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-page signup-page">
      {/* Top brand bar */}
      <header className="auth-header">
        <div className="auth-logo">
          <span className="auth-logo-icon">🏛️</span>
          <div>
            <div className="auth-logo-title">CivicSetu</div>
            <div className="auth-logo-subtitle">
              Bridge between People and Solutions
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="auth-content">
        {/* Left info panel */}
        <div className="auth-info">
          <h1>Join CivicSetu as a Citizen</h1>
          <p>
            Create your CivicSetu account and start reporting issues, supporting
            public complaints, and earning XP for improving your city.
          </p>

          <ul className="auth-info-list">
            <li>Create and track your own complaints</li>
            <li>Support important public issues with votes</li>
            <li>Earn XP badges for active participation</li>
          </ul>

          <div className="auth-contact-box">
            <div className="auth-contact-title">For registration help</div>
            <div className="auth-contact-text">
              Email: support@civicsetu.gov.in
              <br />
              Helpline: 1800-000-000
            </div>
          </div>
        </div>

        {/* Right form card */}
        <div className="auth-card">
          <h2>Citizen Signup</h2>
          <p className="auth-card-subtitle">
            Create your CivicSetu account in a few simple steps.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="name">Full name</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">👤</span>
                <input
                  id="name"
                  className="auth-input"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="email">Email address</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">@</span>
                <input
                  id="email"
                  className="auth-input"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter a valid email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">🔒</span>
                <input
                  id="password"
                  className="auth-input"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                />
              </div>
              <div className="auth-hint">
                At least 8 characters recommended for better security.
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-primary-btn signup-btn" type="submit">
              Create CivicSetu Account
            </button>
          </form>

          <div className="auth-footer-text">
            Already have an account?{" "}
            <span
              className="auth-link"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <footer className="auth-footer">
        © 2026 CivicSetu · Municipal Citizen Services
      </footer>
    </div>
  );
}

export default Signup;
