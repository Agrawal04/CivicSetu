import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // prefill with current values
    setForm({
      name: storedUser.name || "",
      email: storedUser.email || "",
      password: ""
    });
  }, [storedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/update/${storedUser.id}`,
        {
          name: form.name,
          email: form.email,
          password: form.password   // empty string means "do not change" on backend
        }
      );

      // update localStorage with new user data
      const updatedUser = {
        ...storedUser,
        name: res.data.user.name,
        email: res.data.user.email
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage("Profile updated successfully.");
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    }
  };

  return (
    <div className="complaint-bg">
      <div className="complaint-header">
        CivicSetu : Bridge between People and Solutions
      </div>
      <div className="complaint-form-card">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>New Password (optional)</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
          />

          {error && <div className="error">{error}</div>}
          {message && <div className="success-msg">{message}</div>}

          <button className="submit-btn" type="submit">
            Save Changes
          </button>
        </form>
        <button
          className="back-btn"
          type="button"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
