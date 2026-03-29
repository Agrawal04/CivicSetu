// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "../styles/StaffLogin.css"; // reuse your existing login styling

// function StaffLogin() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/staff/login",
//         form
//       );
//       // store staff token & user exactly like citizen, but role will be "staff"
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Staff login failed");
//     }
//   };

//   return (
//      <div className="staff-login-page">
//       <div className="staff-login-box">
//         <h2>Staff Login</h2>
//         <form onSubmit={handleSubmit}>
//           <input
//             className="staff-login-input"
//             name="email"
//             type="email"
//             placeholder="Staff Email"
//             onChange={handleChange}
//             required
//           />
//           <input
//             className="staff-login-input"
//             name="password"
//             type="password"
//             placeholder="Password"
//             onChange={handleChange}
//             required
//           />
//           {error && <div className="staff-login-error">{error}</div>}
//           <button className="staff-login-button" type="submit">
//             Login as Staff
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default StaffLogin;



// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "../styles/StaffLogin.css";

// function StaffLogin() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/staff/login",
//         form
//       );
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Staff login failed");
//     }
//   };

//   return (
//     <div className="staff-auth-page">
//       {/* Top brand bar */}
//       <header className="auth-header">
//         <div className="auth-logo">
//           <span className="auth-logo-icon">🏛️</span>
//           <div>
//             <div className="auth-logo-title">CivicSetu</div>
//             <div className="auth-logo-subtitle">
//               Ujjain Municipal Staff Portal
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main content */}
//       <div className="staff-auth-content">
//         {/* Left info panel */}
//         <div className="staff-info">
//           <h1>Staff Login</h1>
//           <p>
//             Secure access for municipal officers to review, verify, and resolve
//             citizen complaints on CivicSetu.
//           </p>

//           <ul className="staff-info-list">
//             <li>View prioritized complaints by area and category</li>
//             <li>Mark issues as solved or fake complaint</li>
//             <li>Track staff XP for timely resolutions</li>
//           </ul>

//           <div className="staff-security-box">
//             <div className="staff-security-title">Security notice</div>
//             <div className="staff-security-text">
//               This portal is for authorized municipal staff only. All actions
//               are logged for auditing.
//             </div>
//           </div>
//         </div>

//         {/* Right form card */}
//         <div className="staff-login-card">
//           <h2>Staff Login</h2>
//           <p className="staff-card-subtitle">
//             Enter your official credentials to continue.
//           </p>

//           <form onSubmit={handleSubmit} className="auth-form">
//             <div className="auth-field">
//               <label htmlFor="email">Staff email</label>
//               <div className="auth-input-wrapper">
//                 <span className="auth-input-icon">@</span>
//                 <input
//                   id="email"
//                   className="auth-input"
//                   name="email"
//                   type="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   placeholder="name@ujjainmc.gov.in"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="auth-field">
//               <label htmlFor="password">Password</label>
//               <div className="auth-input-wrapper">
//                 <span className="auth-input-icon">🔐</span>
//                 <input
//                   id="password"
//                   className="auth-input"
//                   name="password"
//                   type="password"
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="Enter your password"
//                   required
//                 />
//               </div>
//             </div>

//             {error && <div className="auth-error">{error}</div>}

//             <button className="staff-primary-btn" type="submit">
//               Login as Staff
//             </button>

//             <div className="staff-hint">
//               Having trouble logging in? Contact IT support.
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="auth-footer">
//         © 2026 CivicSetu · Ujjain Municipal Staff Services
//       </footer>
//     </div>
//   );
// }

// export default StaffLogin;







import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/StaffLogin.css";

function StaffLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/staff/login",
        form
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Staff login failed");
    }
  };

  return (
    <div className="staff-auth-page">
      {/* Top brand bar */}
      <header className="auth-header">
        <div className="auth-logo">
          <span className="auth-logo-icon">🏛️</span>
          <div>
            <div className="auth-logo-title">CivicSetu</div>
            <div className="auth-logo-subtitle">
             Municipal Staff Portal
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="staff-auth-content">
        {/* Left info panel */}
        <div className="staff-info">
          <h1>Staff Login</h1>
          <p>
            Secure access for municipal officers to review, verify, and resolve
            citizen complaints on CivicSetu.
          </p>

          <ul className="staff-info-list">
            <li>View prioritized complaints by area and category</li>
            <li>Mark issues as solved or fake complaint</li>
            <li>Track staff XP for timely resolutions</li>
          </ul>

          <div className="staff-security-box">
            <div className="staff-security-title">Security notice</div>
            <div className="staff-security-text">
              This portal is for authorized municipal staff only. All actions
              are logged for auditing.
            </div>
          </div>
        </div>

        {/* Right form card */}
        <div className="staff-login-card">
          <h2>Staff Login</h2>
          <p className="staff-card-subtitle">
            Enter your official credentials to continue.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="email">Staff email</label>
              <div className="staff-input-wrapper">
                <span className="staff-input-icon">@</span>
                <input
                  id="email"
                  className="staff-input"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="staff-input-wrapper">
                <span className="staff-input-icon">🔐</span>
                <input
                  id="password"
                  className="staff-input"
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

            <button className="staff-primary-btn" type="submit">
              Login as Staff
            </button>

            <div className="staff-hint">
              Having trouble logging in? Contact IT support.
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="auth-footer">
        © 2026 CivicSetu · Municipal Staff Services
      </footer>
    </div>
  );
}

export default StaffLogin;
