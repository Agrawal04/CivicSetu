// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "../styles/Login.css";

// function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:5000/api/users/login", form);
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//     }
//   };
// return (
//   <div className="login-page">
//     <div className="login-container">
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           className="login-input"
//           name="email"
//           type="email"
//           placeholder="Email"
//           onChange={handleChange}
//           required
//         />
//         <input
//           className="login-input"
//           name="password"
//           type="password"
//           placeholder="Password"
//           onChange={handleChange}
//           required
//         />
//         {error && <div className="error">{error}</div>}
//         <button className="login-button" type="submit">Login</button>
//       </form>
//       <p>
//         Don't have an account? <a href="/signup">Sign up</a>
//       </p>
//     </div>
//   </div>
// );
// }
// export default Login;



import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        form
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
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
          <h1>Welcome to CivicSetu</h1>
          <p>
            Report issues in your neighborhood, track complaint status, and
            earn XP for helping improve your city.
          </p>

          <ul className="auth-info-list">
            <li>Submit complaints with photos and location</li>
            <li>Support public issues by voting</li>
            <li>Earn XP and level up as an active citizen</li>
          </ul>

          <div className="auth-contact-box">
            <div className="auth-contact-title">Need help?</div>
            <div className="auth-contact-text">
              Email: support@civicsetu.gov.in
              <br />
              Helpline: 1800-000-000
            </div>
          </div>
        </div>

        {/* Right form card */}
        <div className="auth-card">
          <h2>Citizen Login</h2>
          <p className="auth-card-subtitle">
            Sign in to access your complaints, votes, and XP.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
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
                  placeholder="Enter your registered email"
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
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-primary-btn" type="submit">
              Login to CivicSetu
            </button>
          </form>

          <div className="auth-footer-text">
            Don&apos;t have an account?{" "}
            <span
              className="auth-link"
              onClick={() => navigate("/signup")}
            >
              Sign up
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

export default Login;
